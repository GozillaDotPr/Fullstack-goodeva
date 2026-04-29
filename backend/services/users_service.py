from repository.users_repo import UsersRepository
import base64,jwt,os

class UsersService:
    def __init__(self, users_repo: UsersRepository):
        self.users_repo = users_repo

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
    