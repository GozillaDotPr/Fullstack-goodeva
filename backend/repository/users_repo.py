from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from models.users_model import Users

import base64


class UsersRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_email(self, email: str):
        return self.db.query(Users).filter(Users.email == email).first()

