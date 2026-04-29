from repository.users_repo import UsersRepository
import base64,jwt,os,time

from fastapi import HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

class AuthService:
    def __init__(self, users_repository: UsersRepository):
        self.users_repo = users_repository

    def login(self,email,password):
        user = self.users_repo.get_by_email(email)
        if user and user.password == base64.b64encode(password.encode("utf-8")).decode("utf-8"):
            return user
        return None
    
    def generate_jwt(self,payload: dict):
        secret_key = os.getenv("SECRET_KEY")

        if not secret_key:
            raise ValueError("SECRET_KEY is missing")

        return jwt.encode(
            payload,
            secret_key,
            algorithm="HS256"
        )


    def verif_jwt(self, jwt_token: str):
        secret_key = os.getenv("SECRET_KEY")
        if not secret_key:
            raise ValueError("SECRET_KEY is missing")
        
        try:
            payload = jwt.decode(jwt_token, secret_key, algorithms=["HS256"])
            if payload['expired'] < time.time():
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED, 
                    detail="Token sudah kedaluwarsa"
                )

            return payload 
            
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Token sudah kedaluwarsa"
            )
        except jwt.InvalidTokenError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Token tidak valid atau rusak"
            )

   