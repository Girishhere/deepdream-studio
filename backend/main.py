"""
FastAPI server for the DeepDream & Fake Face Detector application.
"""

import io
from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from PIL import Image
from core.fake_detector import run_fake_detection
import base64


# 1. Your AI Engine
from deepdream import process_image 

# 2. Kiran's AI Engine (We will create this file next)
# from fake_detector import detect_image 

app = FastAPI(
    title="DeepDream & XAI Studio API",
    description="Unified API for Artistic Feature Amplification and AI Deepfake Detection.",
    version="2.0.0",
)

# ─── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev server
        "https://deepdream-studio.vercel.app", # Vercel URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Health check ─────────────────────────────────────────────────────────────
@app.get("/", tags=["health"])
async def root():
    return {"status": "ok", "message": "Unified AI API is running"}


# ─── 🎨 MODULE 1: YOUR CREATIVE STUDIO ───────────────────────────────────────
ALLOWED_LAYERS = {"Conv2d_4a_3x3", "Mixed_7a", "Mixed_5b"}
DEFAULT_LAYER  = "Mixed_5b"

@app.post("/generate-dream/", tags=["deepdream"])
async def generate_dream(
    file: UploadFile = File(...),
    layer_name: str  = Form(DEFAULT_LAYER),
):
    if layer_name not in ALLOWED_LAYERS:
        layer_name = DEFAULT_LAYER

    if file.content_type not in ("image/jpeg", "image/png", "image/webp", "image/bmp"):
        raise HTTPException(status_code=415, detail="Unsupported image type.")

    try:
        raw_bytes = await file.read()
        pil_image = Image.open(io.BytesIO(raw_bytes)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not decode image: {e}")

    try:
        dreamed_image = process_image(pil_image, layer_name=layer_name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DeepDream processing failed: {e}")

    output_buffer = io.BytesIO()
    dreamed_image.save(output_buffer, format="JPEG", quality=92)
    output_buffer.seek(0)

    return StreamingResponse(
        output_buffer,
        media_type="image/jpeg",
        headers={"Content-Disposition": "inline; filename=dreamed.jpg"},
    )


# ─── 🕵️‍♂️ MODULE 2: KIRAN'S FORENSIC LAB ───────────────────────────────────────
@app.post("/detect-fake/", tags=["forensics"])
async def detect_fake(file: UploadFile = File(...)):
    if file.content_type not in ("image/jpeg", "image/png", "image/webp", "image/bmp"):
        raise HTTPException(status_code=415, detail="Unsupported image type.")

    try:
        raw_bytes = await file.read()
        pil_image = Image.open(io.BytesIO(raw_bytes)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not decode image: {e}")

    try:
        # Run Kiran's Logic
        results = run_fake_detection(pil_image)
        
        # Convert the Grad-CAM heatmap back to a Base64 string so React can display it
        buffered = io.BytesIO()
        results["heatmap_image"].save(buffered, format="JPEG", quality=90)
        heatmap_base64 = base64.b64encode(buffered.getvalue()).decode("utf-8")
        
        return JSONResponse(content={
            "status": "success",
            "prediction": results["prediction"],
            "confidence": results["confidence"],
            "heatmap": f"data:image/jpeg;base64,{heatmap_base64}"
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Forensic analysis failed: {e}")