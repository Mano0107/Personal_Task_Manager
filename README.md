# SmartSprint - AI Powered Task Management System

## Project Overview
SmartSprint is a complete, production-ready Task Management System designed to boost productivity through intelligent task prioritization. Built with a full-stack architecture, it leverages a robust FastAPI backend, a secure PostgreSQL database, and JWT authentication. The responsive, premium dashboard UI features a modern glassmorphism aesthetic. A standout feature is its AI-based task prioritization, which automatically evaluates task urgency based on deadlines and key phrases, helping users focus on what matters most.

## Tech Stack
- **Frontend**: HTML, CSS (Custom Glassmorphism Design), Vanilla JavaScript
- **Backend**: FastAPI (Python), SQLAlchemy
- **Database**: PostgreSQL
- **Authentication**: JWT Authentication

## Key Features
- Secure JWT Authentication
- User Registration & Login
- Task CRUD Operations
- Task Completion Tracking
- AI-Based Smart Priority Suggestions
- PostgreSQL Integration
- REST API Architecture
- Responsive Glassmorphism Dashboard UI

## AI-Based Intelligent Feature
SmartSprint includes a rule-based intelligent task prioritization engine to enhance productivity. It automatically assigns priorities to tasks based on deadline proximity and urgency keyword detection.

**Priority Logic:**
- **High**: Tasks due within 24 hours OR containing critical keywords (e.g., *urgent*, *important*, *meeting*, *critical*).
- **Medium**: Tasks due within 3 days.
- **Low**: Tasks with longer deadlines.

## Project Structure
```text
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

## Environment Variables

Create a `.env` file inside the `backend` folder and configure the following variables:

```env
DATABASE_URL=postgresql://postgres:password@localhost/taskmanager
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
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

## API Documentation

Swagger UI is available for testing the API endpoints:
http://localhost:8000/docs

## Future Enhancements
- Push notifications
- Drag and drop tasks
- AI deadline prediction
- Task analytics
- Mobile responsiveness
- Team collaboration

## Author
Designed and developed as a comprehensive full-stack portfolio project, showcasing modern web development best practices, intelligent API design, and premium UI/UX aesthetics.
