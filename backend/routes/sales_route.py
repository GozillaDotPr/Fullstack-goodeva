from fastapi import APIRouter

from handlers.sales_handler import SalesHandler
from fastapi import Depends

from dependencies import get_sales_handler,require_jwt
router = APIRouter(
    prefix="/sales",
    tags=["Sales"]
)


@router.get("/")
def get_sales(
    handler: SalesHandler = Depends(get_sales_handler),
    payload = Depends(require_jwt)
):
    return handler.get_all_sales()


