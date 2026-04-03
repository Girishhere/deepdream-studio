DeepDream Studio 
**Malla Reddy University · AD Project 2026**

An interactive, full-stack AI visualization suite that allows users to explore the "inner thoughts" of deep neural networks.

## 🛠️ The Stack
| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18 & Framer Motion | Cinematic UI & Motion Design |
| **Backend** | FastAPI (Python) | High-performance REST Gateway |
| **AI Engine** | PyTorch | InceptionV3 Gradient Ascent math |
| **UX** | Lenis | Studio-grade smooth scrolling |

## 📖 Key Features
* **X-Ray Hero:** An interactive mouse-tracking binary mask that reveals the "code" behind the interface.
* **System Architecture:** A scroll-triggered, animated timeline detailing the data flow from Tensor to UI.
* **DeepDream Studio:** A high-end lab interface for uploading images and targeting specific CNN layers.
* **Interactive Wiki:** An educational module breaking down the anatomy of Convolutional Neural Networks.

---

## 💻 Installation & Setup

### 1. Prerequisites
* Python 3.10+
* Node.js (v18+)
* Git

### 2. Backend Setup (AI Engine)
```bash
cd backend
# Create virtual environment
python -m venv venv
# Activate (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python -m uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup (UI)
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:5173` to view the studio.

---

## 👷 Architects (Group 6)
* **Girish Choudhary** (@girishhere) — *Frontend & UI Lead*
* **Rajnish Kumar** — *AI Architecture*
* **K. Sasi Kiran** — *Backend Systems*
* **T. Prudhvi Raj Singh** — *Data Pipeline*

## 🧬 Acknowledgements & Research
This project implements the mathematical concepts of **Inceptionism: Going Deeper into Neural Networks**. 
* **Core Logic Inspired by:** [Aleksa Gordić (pytorch-deepdream)](https://github.com/gordicaleksa/pytorch-deepdream)
* **Model:** Google InceptionV3 pretrained on ImageNet.
