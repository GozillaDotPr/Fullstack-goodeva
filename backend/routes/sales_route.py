from fastapi import APIRouter

from handlers.sales_handler import SalesHandler
from fastapi import Depends
from pydantic import BaseModel


from dependencies import get_sales_handler,require_jwt
router = APIRouter(
    prefix="/sales",
    tags=["Sales"]
)

class PrediksiInput(BaseModel):
    jumlah_penjualan: int
    harga: int
    diskon: int


@router.get("/")
def get_sales(
    handler: SalesHandler = Depends(get_sales_handler),
    payload = Depends(require_jwt)
):
    return handler.get_all_sales()

@router.post("/prediksi")
def predik(
    payload : PrediksiInput,
    handler: SalesHandler = Depends(get_sales_handler),
    payload2 = Depends(require_jwt)
):
    return handler.prediksi(payload.jumlah_penjualan,payload.harga,payload.diskon)


