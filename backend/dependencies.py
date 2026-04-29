from repository.sales_repo import SalesRepository
from services.sales_service import SalesService
from handlers.sales_handler import SalesHandler
from database import SessionLocal
from repository.users_repo import UsersRepository
from services.users_service import UsersService
from handlers.auth_handler import AuthHandler

from fastapi import Depends


def get_users_repository():
    db = SessionLocal()
    return UsersRepository(db)


def get_users_service(
    repo: UsersRepository = Depends(get_users_repository)
):
    return UsersService(repo)


def get_auth_handler(
    service: UsersService = Depends(get_users_service)
):
    return AuthHandler(service)


def get_sales_repository():
    db = SessionLocal()
    return SalesRepository(db)


def get_sales_service(
    repo: SalesRepository = Depends(get_sales_repository)
):
    return SalesService(repo)


def get_sales_handler(
    service: SalesService = Depends(get_sales_service)
):
    return SalesHandler(service)