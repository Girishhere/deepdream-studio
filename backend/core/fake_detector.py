import os
import torch
import torch.nn as nn
from torchvision import transforms, models
import numpy as np
import cv2
from PIL import Image

# Setup Device and Paths
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "weights", "efficientnet_fakeface.pth")

# Global model variable to avoid reloading on every API call
_model = None

def load_model():
    """Loads the EfficientNetB0 model with Kiran's custom classifier head."""
    global _model
    if _model is not None:
        return _model

    print("[Forensic Lab] Loading EfficientNetB0...")
    model = models.efficientnet_b0(weights=None)
    model.classifier = nn.Sequential(
        nn.Dropout(p=0.3),
        nn.Linear(model.classifier[1].in_features, 2)
    )
    
    # Check if Kiran's trained weights exist
    if os.path.exists(MODEL_PATH):
        state_dict = torch.load(MODEL_PATH, map_location=DEVICE)
        model.load_state_dict(state_dict)
    else:
        print(f"⚠️ WARNING: Weights not found at {MODEL_PATH}. Using untrained model for layout testing.")

    model.eval()
    _model = model.to(DEVICE)
    return _model

# Standard ImageNet transform used in Kiran's training
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

def generate_gradcam(model, image_tensor):
    """Generates a Grad-CAM heatmap to explain the model's decision."""
    gradients = []
    activations = []

    def backward_hook(module, grad_in, grad_out):
        gradients.append(grad_out[0])

    def forward_hook(module, input, output):
        activations.append(output)

    # Attach hooks to the last convolutional layer
    target_layer = model.features[-1]
    handle_forward = target_layer.register_forward_hook(forward_hook)
    handle_backward = target_layer.register_full_backward_hook(backward_hook)

    # Forward pass
    output = model(image_tensor)
    pred_class = output.argmax()

    # Backward pass to get gradients
    model.zero_grad()
    output[0, pred_class].backward()

    # REMOVE HOOKS (Crucial fix for FastAPI memory leak)
    handle_forward.remove()
    handle_backward.remove()

    grads = gradients[0].detach().cpu().numpy()[0]
    acts = activations[0].detach().cpu().numpy()[0]

    # Global average pooling
    weights = np.mean(grads, axis=(1, 2))
    cam = np.zeros(acts.shape[1:], dtype=np.float32)

    for i, w in enumerate(weights):
        cam += w * acts[i]

    # ReLU and normalize
    cam = np.maximum(cam, 0)
    cam = cv2.resize(cam, (224, 224))
    cam = cam - cam.min()
    cam = cam / (cam.max() + 1e-8)

    return cam

def run_fake_detection(pil_image):
    """
    Main inference function.
    Takes a PIL image, returns prediction, confidence, and a heatmap PIL image.
    """
    model = load_model()
    
    # Prepare image
    img_tensor = transform(pil_image).unsqueeze(0).to(DEVICE)
    
    # Run prediction
    with torch.no_grad():
        output = model(img_tensor)
        prob = torch.softmax(output, dim=1)
        confidence, pred = torch.max(prob, 1)

    class_names = ["AI Generated", "Real"]
    result_class = class_names[pred.item()]
    confidence_percent = round(confidence.item() * 100, 2)

    # Generate Explainability Map (Grad-CAM)
    # Re-enable gradients temporarily just for Grad-CAM
    with torch.enable_grad():
        img_tensor_grad = img_tensor.clone().requires_grad_(True)
        cam = generate_gradcam(model, img_tensor_grad)

    # Overlay heatmap on original image
    heatmap = cv2.applyColorMap(np.uint8(255 * cam), cv2.COLORMAP_JET)
    heatmap = np.float32(heatmap) / 255
    original = np.array(pil_image.resize((224, 224)).convert("RGB"), dtype=np.float32) / 255
    
    overlay = np.clip(heatmap * 0.4 + original, 0.0, 1.0)
    overlay_uint8 = np.uint8(255 * overlay)
    explainability_image = Image.fromarray(overlay_uint8)

    return {
        "prediction": result_class,
        "confidence": confidence_percent,
        "heatmap_image": explainability_image
    }