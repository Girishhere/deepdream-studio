"""
FastAPI server for the DeepDream application.
Endpoint: POST /generate-dream/
  - Accepts: multipart/form-data with an image file
  - Returns:  JPEG image stream with DeepDream effect applied
"""

import io
from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from PIL import Image

from deepdream import process_image

app = FastAPI(
    title="DeepDream API",
    description="Apply PyTorch DeepDream transformations to uploaded images.",
    version="1.0.0",
)

# ─── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev server
        "http://localhost:3000",   # CRA / fallback
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Health check ─────────────────────────────────────────────────────────────
@app.get("/", tags=["health"])
async def root():
    return {"status": "ok", "message": "DeepDream API is running"}


# ─── Allowed inception layers ────────────────────────────────────────────────
ALLOWED_LAYERS = {"Conv2d_4a_3x3", "Mixed_7a", "Mixed_5b"}
DEFAULT_LAYER  = "Mixed_5b"


# ─── Main endpoint ────────────────────────────────────────────────────────────
@app.post("/generate-dream/", tags=["deepdream"])
async def generate_dream(
    file: UploadFile = File(...),
    layer_name: str  = Form(DEFAULT_LAYER),
):
    """
    Accept an image upload + optional layer_name, apply DeepDream, return JPEG.

    layer_name options:
      - Conv2d_4a_3x3  → basic edges / lines
      - Mixed_7a  → complex textures / eyes
      - Mixed_5b  → high-level objects / hallucinations (default)
    """
    # Gracefully fall back to default for invalid layer names
    if layer_name not in ALLOWED_LAYERS:
        layer_name = DEFAULT_LAYER

    # Validate MIME type
    if file.content_type not in ("image/jpeg", "image/png", "image/webp", "image/bmp"):
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported image type: {file.content_type}. Use JPEG, PNG, or WebP.",
        )

    try:
        raw_bytes = await file.read()
        pil_image = Image.open(io.BytesIO(raw_bytes)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not decode image: {e}")

    # Process — this is the heavy ML step
    try:
        dreamed_image = process_image(pil_image, layer_name=layer_name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DeepDream processing failed: {e}")

    # Encode result as JPEG and stream back
    output_buffer = io.BytesIO()
    dreamed_image.save(output_buffer, format="JPEG", quality=92)
    output_buffer.seek(0)

    return StreamingResponse(
        output_buffer,
        media_type="image/jpeg",
        headers={"Content-Disposition": "inline; filename=dreamed.jpg"},
    )
