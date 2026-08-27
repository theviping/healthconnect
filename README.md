# HealthConnect

AI-based symptom analysis and doctor appointment management system.
Final year B.Tech major project.

## Structure

```
backend/       Node.js + Express API (auth, booking, chat routing)
ml-service/    Python Flask microservice (symptom prediction)
frontend/      React app (patient + doctor/admin interfaces)
docs/          Project reports (Review 1-3 docs live here)
```

## Getting started

### 1. Backend
```
cd backend
npm install
cp .env.example .env    # fill in MONGO_URI and JWT_SECRET
npm run dev
```
Runs on http://localhost:5000

### 2. ML service
```
cd ml-service
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
# Place the Kaggle symptom dataset at ml-service/data/dataset.csv
python train_model.py         # trains and saves the best model
python app.py                 # serves predictions on http://localhost:8000
```

### 3. Frontend
```
cd frontend
npm install
npm run dev
```
Runs on http://localhost:5173 (Vite default)

## Current status

- [x] Repo structure
- [x] Auth (register/login) — backend
- [x] User, Appointment, SymptomCheck, HealthRecord models
- [x] ML training script + Flask prediction endpoint (needs dataset.csv)
- [ ] Appointment booking routes
- [ ] Symptom-check route wiring backend -> ML service
- [ ] Chat/video (Socket.io/WebRTC)
- [ ] React UI screens

## Review mapping

See `docs/` for the Review 1, 2, and 3 submission documents.
