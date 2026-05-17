@echo off

echo Starting backend...
start cmd /k "cd backend && call venv\Scripts\activate && uvicorn main:app --reload --port 8000"

timeout /t 5 > nul

echo Starting frontend...
start cmd /k "cd frontend && npm run dev"

timeout /t 8 > nul

start http://localhost:3000
start http://127.0.0.1:8000/docs

echo Project started!