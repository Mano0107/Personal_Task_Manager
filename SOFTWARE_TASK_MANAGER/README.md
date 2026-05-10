# SmartSprint - AI Powered Task Management System

## Project Overview

SmartSprint is a modern full-stack Task Management System designed to improve personal productivity through intelligent task prioritization. The application provides secure authentication, task management features, and an AI-inspired priority engine that helps users focus on high-impact tasks.

The project is built using FastAPI, PostgreSQL, and Vanilla JavaScript with a responsive glassmorphism-based dashboard UI.

---

# Features

* Secure JWT Authentication
* User Registration & Login
* Task CRUD Operations
* Task Completion Tracking
* AI-Based Smart Priority Suggestions
* PostgreSQL Database Integration
* RESTful API Architecture
* Responsive Dashboard UI
* Dark Glassmorphism Design

---

# Tech Stack

## Frontend

* HTML5
* CSS3
* Vanilla JavaScript

## Backend

* FastAPI (Python)
* SQLAlchemy

## Database

* PostgreSQL

## Authentication

* JWT Authentication

---

# AI-Based Intelligent Feature

SmartSprint includes an intelligent rule-based task prioritization system.

The system automatically assigns task priority levels based on:

* Deadline proximity
* Urgency keywords in task title or description

## Priority Logic

### High Priority

Assigned when:

* Task deadline is within 24 hours
* Task contains keywords like:

  * urgent
  * important
  * critical
  * meeting

### Medium Priority

Assigned when:

* Task deadline is within 3 days

### Low Priority

Assigned for:

* Tasks with longer deadlines

---

# Project Structure

```bash
SmartSprint/
│
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
│   │
│   ├── requirements.txt
│   ├── .env
│
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   │
│   ├── css/
│   │   ├── style.css
│   │
│   ├── js/
│   │   ├── utils.js
│   │   ├── dashboard.js
│
├── README.md
```

---

# Environment Variables

Create a `.env` file inside the `backend` folder and configure the following:

```env
DATABASE_URL=postgresql://postgres:password@localhost/taskmanager
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

# Setup Instructions

## 1. Database Setup

* Install PostgreSQL
* Create a database named:

```bash
taskmanager
```

---

# 2. Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment:

### Windows

```bash
venv\Scripts\activate
```

### Mac/Linux

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the FastAPI server:

```bash
uvicorn app.main:app --reload
```

Backend runs on:

```bash
http://localhost:8000
```

---

# 3. Frontend Setup

Navigate to frontend folder:

```bash
cd frontend
```

Run local server:

```bash
python -m http.server 5500
```

Frontend runs on:

```bash
http://localhost:5500
```

---

# API Documentation

Swagger API documentation:

```bash
http://localhost:8000/docs
```

---

# Core Functionalities

* User Authentication
* Task Creation
* Task Editing
* Task Deletion
* Task Completion Toggle
* AI-Based Priority Detection
* Dashboard Task Filtering
* Responsive UI Design

---

# Future Enhancements

* Push Notifications
* Drag and Drop Tasks
* AI Deadline Prediction
* Task Analytics Dashboard
* Mobile Responsive Optimization
* Team Collaboration Features

---

# Author

Developed by MANORANJAN K as part of a full-stack internship assessment project demonstrating:

* User authentication system
* Task CRUD operations
* PostgreSQL database integration
* AI-based task prioritization
* Responsive dashboard UI
* Full-stack development using FastAPI and JavaScript

