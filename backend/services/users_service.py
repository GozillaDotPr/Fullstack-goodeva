from repository.users_repo import UsersRepository
import base64,jwt,os

class UsersService:
    def __init__(self, users_repo: UsersRepository):
        self.users_repo = users_repo

   