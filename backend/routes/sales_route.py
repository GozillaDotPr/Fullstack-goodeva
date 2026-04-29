from fastapi import APIRouter
from dependencies import get_sales_handler
from handlers.sales_handler import SalesHandler
from fastapi import Depends

router = APIRouter(
    prefix="/sales",
    tags=["Sales"]
)


@router.get("/")
def get_sales(
    handler: SalesHandler = Depends(get_sales_handler)
):
    return handler.get_all_sales()
    

