from repository.sales_repo import SalesRepository
from services.sales_service import SalesService
from handlers.sales_handler import SalesHandler
from database import SessionLocal

from fastapi import Depends


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