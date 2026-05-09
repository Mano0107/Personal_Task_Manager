# Task Management System

A complete mini Task Management System built with FastAPI, PostgreSQL, and Vanilla JavaScript.

## Tech Stack
- **Frontend**: HTML, CSS (Custom Glassmorphism Design), Vanilla JavaScript
- **Backend**: FastAPI (Python), SQLAlchemy
- **Database**: PostgreSQL
- **Authentication**: JWT Authentication

## Features
1. User Registration & Login
2. JWT Authentication
3. Task CRUD (Create, Read, Update, Delete)
4. Mark Task as Complete
5. Smart AI Priority Suggestion
   - High: Due within 1 day or contains keywords (urgent, important, meeting)
   - Medium: Due within 3 days
   - Low: Otherwise
6. Clean Folder Structure
7. Responsive, Premium Dark-mode Glassmorphism UI

## Project Structure
```
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   │   ├── auth.py
│   │   │   ├── tasks.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── database.py
│   │   ├── utils.py
│   │   ├── config.py
│   ├── .env
│   ├── requirements.txt
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── css/
│   │   ├── style.css
│   ├── js/
│   │   ├── utils.js
│   │   ├── dashboard.js
```

## Setup Instructions

### Database
1. Make sure you have PostgreSQL installed and running.
2. Create a database named `taskmanager`.

### Backend
1. Navigate to the `backend` directory.
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Configure your PostgreSQL connection in `.env`.
6. Start the FastAPI server: `uvicorn app.main:app --reload` (Runs on http://localhost:8000)

### Frontend
1. Open the `frontend/index.html` file in your browser, or serve it using a local static server like Live Server or Python's `http.server`:
   - `cd frontend`
   - `python -m http.server 3000`
2. Navigate to `http://localhost:3000`

## Author
Built as a complete full-stack demonstration.
