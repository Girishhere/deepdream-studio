# DeepDream Studio & AI Forensic Lab 🔍✨

A full-stack, dual-engine AI visualization suite built for the Malla Reddy University AD Project. This application allows users to explore the "inner thoughts" of deep neural networks through image hallucination, while also detecting AI-generated forgeries using Explainable AI (XAI).

## 🛠️ The Architecture
| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite & React Router | Dual-Page SPA with Cinematic Motion UI |
| **Backend** | FastAPI (Python) | High-performance REST Gateway & Tensor Management |
| **Engine A (Dream)** | PyTorch + InceptionV3 | Forward hooks & Gradient Ascent Optimization |
| **Engine B (Forensics)**| PyTorch + EfficientNetB0 | XAI Classification & Grad-CAM Heatmaps |

## 📖 Core Features
- **Dual-Engine Routing:** Seamlessly switch between the Creative Studio and the Forensic Lab as a Single Page Application (SPA).
- **Creative Studio (DeepDream):** Target specific CNN layers (e.g., `Mixed_5b`) to amplify edges, textures, or full object hallucinations using iterative gradient ascent and octave scaling.
- **AI Forensic Lab (Deepfake Detection):** Upload an image to our V2 fine-tuned EfficientNet classifier. The system combats overconfidence bias and generates a Grad-CAM heatmap highlighting the exact pixels that influenced the model's decision.
- **Interactive Wiki:** Educational breakdown of CNN anatomy, forward hooks, and ML pipelines.

## 🚀 Quick Start
**1. Start the Backend (FastAPI)**
\`\`\`bash
cd backend
python -m uvicorn main:app --reload
\`\`\`

**2. Start the Frontend (React)**
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

## 🧬 Acknowledgements
This project is inspired by the PyTorch implementation of DeepDream by [Aleksa Gordić](https://github.com/gordicaleksa/pytorch-deepdream). We have adapted the core mathematical concepts into a full-stack modern web application, integrated with a custom Explainable AI forgery detection pipeline.