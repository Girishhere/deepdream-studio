"""
DeepDream processing logic.
Adapted from gordicaleksa/pytorch-deepdream (https://github.com/gordicaleksa/pytorch-deepdream)

Core idea:
  - Hook into an intermediate layer of a pre-trained InceptionV3 model.
  - Run gradient ascent: maximize the L2 norm of the layer's activations.
  - Apply across multiple 'octaves' (image scales) to produce multi-scale hallucinations.
"""

import io
import numpy as np
from PIL import Image

import torch
import torch.nn as nn
import torchvision.models as models
import torchvision.transforms as T

# ─── Device ───────────────────────────────────────────────────────────────────
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"[DeepDream] Using device: {DEVICE}")

# ─── Model loading (cached at module level) ───────────────────────────────────
_model = None
_activation = {}


def _get_model():
    global _model
    if _model is None:
        print("[DeepDream] Loading InceptionV3 weights …")
        inception = models.inception_v3(weights=models.Inception_V3_Weights.IMAGENET1K_V1)
        inception.eval()
        inception.to(DEVICE)
        # Remove the classifier head — we only need features
        _model = inception
        print("[DeepDream] Model ready.")
    return _model


# ─── Hook storage ─────────────────────────────────────────────────────────────
class FeatureHook:
    """Captures the output of a registered layer."""
    def __init__(self):
        self.activation = None

    def __call__(self, module, input, output):
        self.activation = output


_hook_handle = None
_feature_hook = FeatureHook()


def _register_hook(model, layer_name: str = "Mixed_5b"):
    """Register a forward hook on the named InceptionV3 sub-module."""
    global _hook_handle
    if _hook_handle is not None:
        _hook_handle.remove()
    target = dict(model.named_modules())[layer_name]
    _hook_handle = target.register_forward_hook(_feature_hook)


# ─── Image <-> Tensor helpers ─────────────────────────────────────────────────
MEAN = torch.tensor([0.485, 0.456, 0.406], device=DEVICE).view(3, 1, 1)
STD  = torch.tensor([0.229, 0.224, 0.225], device=DEVICE).view(3, 1, 1)


def _pil_to_tensor(img: Image.Image) -> torch.Tensor:
    """PIL Image (RGB) → normalised float32 tensor [1, C, H, W]."""
    arr = np.array(img).astype(np.float32) / 255.0
    t = torch.from_numpy(arr).permute(2, 0, 1).to(DEVICE)  # [C, H, W]
    t = (t - MEAN) / STD
    return t.unsqueeze(0)  # [1, C, H, W]


def _tensor_to_pil(t: torch.Tensor) -> Image.Image:
    """Normalised tensor [1, C, H, W] → PIL Image (RGB, uint8)."""
    t = t.squeeze(0)                      # [C, H, W]
    t = t * STD + MEAN                    # de-normalise
    t = t.clamp(0, 1)
    arr = (t.permute(1, 2, 0).detach().cpu().numpy() * 255).astype(np.uint8)
    return Image.fromarray(arr)


def _resize_tensor(t: torch.Tensor, size: tuple) -> torch.Tensor:
    """Resize a [1, C, H, W] tensor to (H, W) using bilinear interpolation."""
    return nn.functional.interpolate(
        t, size=size, mode="bilinear", align_corners=False
    )


# ─── Single-octave gradient ascent ────────────────────────────────────────────
def _dream_step(model, img_tensor: torch.Tensor, lr: float, num_iterations: int) -> torch.Tensor:
    """
    Run `num_iterations` gradient-ascent steps and return the modified tensor.
    """
    img = img_tensor.clone().requires_grad_(True)

    for _ in range(num_iterations):
        model.zero_grad()
        _ = model(img)                          # forward pass → hook fires

        activation = _feature_hook.activation
        loss = activation.norm()               # maximise L2 norm of activations
        loss.backward()

        with torch.no_grad():
            grad = img.grad.data
            # Normalise gradient for stable updates
            grad /= grad.std() + 1e-8
            img.data += lr * grad
            img.grad.data.zero_()

    return img.detach()


# ─── Public API ───────────────────────────────────────────────────────────────
def process_image(
    pil_image: Image.Image,
    layer_name: str = "Mixed_5b",
    num_octaves: int = 4,
    octave_scale: float = 1.4,
    num_iterations: int = 10,
    lr: float = 0.09,
    max_size: int = 512,
) -> Image.Image:
    """
    Apply DeepDream to a PIL Image and return the processed PIL Image.

    Parameters
    ----------
    pil_image     : Input RGB image.
    layer_name    : InceptionV3 sub-module to hook into.
    num_octaves   : Number of scale levels (more = richer details, slower).
    octave_scale  : Downscale factor between octaves.
    num_iterations: Gradient-ascent steps per octave.
    lr            : Learning rate (step size) for gradient ascent.
    max_size      : Longest edge is resized to this before processing.

    Returns
    -------
    PIL Image with DeepDream effect applied.
    """
    model = _get_model()
    _register_hook(model, layer_name)

    # Convert to RGB and cap resolution to keep processing time reasonable
    img = pil_image.convert("RGB")
    w, h = img.size
    if max(w, h) > max_size:
        scale = max_size / max(w, h)
        img = img.resize((int(w * scale), int(h * scale)), Image.LANCZOS)

    base_tensor = _pil_to_tensor(img)           # [1, C, H, W]

    # Build octave pyramid (smallest → largest)
    octave_tensors = [base_tensor]
    for _ in range(num_octaves - 1):
        prev = octave_tensors[-1]
        _, _, oh, ow = prev.shape
        new_h = max(1, int(oh / octave_scale))
        new_w = max(1, int(ow / octave_scale))
        octave_tensors.append(_resize_tensor(prev, (new_h, new_w)))

    octave_tensors = list(reversed(octave_tensors))  # smallest first

    detail = torch.zeros_like(octave_tensors[0])

    for i, octave_tensor in enumerate(octave_tensors):
        _, _, oh, ow = octave_tensor.shape
        # Upsample accumulated detail from previous octave
        detail_up = _resize_tensor(detail, (oh, ow))
        input_tensor = octave_tensor + detail_up

        # Gradient ascent
        dreamed = _dream_step(model, input_tensor, lr, num_iterations)

        # Accumulate detail residual
        detail = dreamed - octave_tensor

    # Final image = original base + all accumulated detail
    final_tensor = base_tensor + _resize_tensor(detail, base_tensor.shape[2:])
    return _tensor_to_pil(final_tensor)
