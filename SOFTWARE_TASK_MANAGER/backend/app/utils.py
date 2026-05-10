from passlib.context import CryptContext
from datetime import datetime, timedelta, date, timezone
from typing import Optional
from jose import JWTError, jwt
from .config import settings
import re

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def calculate_priority(title: str, description: Optional[str], due_date: Optional[date]) -> str:
    text = f"{title} {description}".lower() if description else title.lower()
    
    # Check keywords
    keywords = ["urgent", "important", "meeting"]
    for word in keywords:
        if re.search(rf"\b{word}\b", text):
            return "High"

    # Check due date
    if due_date:
        today = date.today()
        delta = (due_date - today).days
        if delta <= 1:
            return "High"
        elif delta <= 3:
            return "Medium"
            
    return "Low"
