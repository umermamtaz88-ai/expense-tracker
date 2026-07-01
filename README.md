# Expense Tracker — Full Stack Application

Production-ready expense tracker with FastAPI backend and Next.js frontend.

## Project Structure

```text
expeness-frontend/          (workspace root)
├── expeness-tracker/       (backend — FastAPI)
└── expeness-frontend/    (expense-frontend — Next.js)
```

## Run

**Backend:**
```bash
cd expeness-tracker
.\venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd expeness-frontend
npm install
npm run dev
```

See `expeness-frontend/README.md` for full documentation.
