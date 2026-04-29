from services.users_service import UsersService
from dto.respone import baseRespone, errorRespone
import time

class AuthHandler:
    def __init__(self, users_service: UsersService):
        self.users_service = users_service

    def login(self,email,password):
        result = self.users_service.login(email,password)

        if not result:
            return errorRespone("Invalid email or password",status_code=401)

        token = self.users_service.generate_jwt({
            "id": result.id,
            "email": result.email,
            "expired": int(time.time()) + 3600 
        })
        return baseRespone({
            "token": token
        }, "Login success")
