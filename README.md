# Skincare Recommendation System  
**AI-Powered Skin Type Detection using Vision Transformer (ViT)**  

Upload a selfie → Get instant skin type prediction:  
**Combination • Dry • Normal • Oily • Sensitive**

A full-stack application with a Next.js frontend, Go backend, and a fine-tuned Vision Transformer model for skin type prediction.

---

## Tech Stack
| Component     | Technology                                      |
|---------------|-------------------------------------------------|
| Frontend      | Next.js                                         |
| Backend       | Go + Gin + GORM                                 |
| Database      | PostgreSQL                                      |
| ML Model      | Vision Transformer (`vit_base_patch16_224`)     |
| Inference     | Python script (called automatically by Go)      |
| Training      | Google Colab                                    |

---

## Project Structure
|──| backend/ → Go server
|  |__ .env
├── frontend/ → Next.js app
|  |__ .env
├── python/ → Python model & scripts
│ ├── vit_skin_type_224.pth
│ ├── predict.py
│ └── venv/
└── README.md


## Repository Setup
```bash
git clone git@github.com:raj1552/Skincare-Recommendation-System.git
cd Skincare-Recommendation-System

1. Download the Trained Model
Place the file inside the python/ folder:
File: vit_skin_type_224.pth
Download Link: Google Drive
Final path: python/vit_skin_type_224.pth

2. Environment Variables
Backend .env (project root):
PORT=
DB_URL="host= user= password= dbname= port= sslmode=disable"
SECRET=supersecretkey1234567890

Frontend .env (frontend/.env):
NEXT_PUBLIC_API_URL=http://localhost:3000
3. Database & Migrations
createdb skincare_db

cd backend
go run migrate/migrate.go

4. Python Dependencies (One-Time Setup)
cd python
python -m venv venv

# Activate virtual environment
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

pip install torch torchvision timm pillow
You do NOT need to run the Python script manually — the Go backend handles inference automatically.

5. Run the Application
Backend:
cd backend
go run main.go

Frontend:
cd ../frontend
npm install
npm run dev
Open your browser at http://localhost:3001