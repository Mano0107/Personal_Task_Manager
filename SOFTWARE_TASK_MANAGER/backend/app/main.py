from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base

# IMPORTANT: Import models BEFORE create_all
from . import models

from .routes import auth, tasks

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Task Management API")

from .config import settings

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(tasks.router)

# Root Route
@app.get("/")
def root():
    return {"message": "Welcome to the Task Manager API"}