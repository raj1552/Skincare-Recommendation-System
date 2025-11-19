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
| ML Model      | Vision Transformer (`vit_base_patch16_224`)    |
| Inference     | Python script (called automatically by Go)      |
| Training      | Google Colab                                    |

---

## Project Structure
```
Skincare-Recommendation-System/
├── backend/
│   ├── .env
│   └── (Go server files)
├── frontend/
│   ├── .env
│   └── (Next.js app files)
├── python/
│   ├── vit_skin_type_224.pth
│   ├── predict.py
│   └── venv/
└── README.md
```

---

## Repository Setup
```bash
git clone git@github.com:raj1552/Skincare-Recommendation-System.git
cd Skincare-Recommendation-System
```

### 1. Download the Trained Model

Place the file inside the `python/` folder:

- **File:** `vit_skin_type_224.pth`
- **Download Link:** [Google Drive](#) *(add your actual link)*
- **Final path:** `python/vit_skin_type_224.pth`

### 2. Environment Variables

**Backend `.env`** (in `backend/` folder):
```env
PORT=3000
DB_URL="host=localhost user=youruser password=yourpass dbname=skincare_db port=5432 sslmode=disable"
SECRET=supersecretkey1234567890
```

**Frontend `.env`** (in `frontend/` folder):
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Database & Migrations
```bash
createdb skincare_db
cd backend
go run migrate/migrate.go
```

### 4. Python Dependencies (One-Time Setup)
```bash
cd python
python -m venv venv

# Activate virtual environment
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

pip install torch torchvision timm pillow
```

> **Note:** You do NOT need to run the Python script manually — the Go backend handles inference automatically.

### 5. Run the Application

**Backend:**
```bash
cd backend
go run main.go
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Open your browser at **http://localhost:3001**

---

## Features

- 🔍 Real-time skin type detection from selfies
- 🎯 5 skin type classifications
- 🚀 Fast inference with Vision Transformer
- 💾 PostgreSQL database for user data
- 🔐 Secure authentication

---

## License

MIT License