from services.sales_service import SalesService
from dto.respone import baseRespone,errorRespone
from fastapi.encoders import jsonable_encoder

class SalesHandler:
    def __init__(self, service: SalesService):
        self.service = service
    
    def get_all_sales(self):
        data = self.service.get_all_sales()

        return baseRespone(
            data=jsonable_encoder(data),
            message="Sales data retrieved successfully",
            status_code=200
        )

    def prediksi(self, jumlah_penjualan: int, harga: int, diskon: int):
        if not self.service.is_model_ready():
            return errorRespone(
                message="Something Error Please Contact Admin or try again later",
                status_code=503
            )
        
        try:
            result = self.service.prediksi(jumlah_penjualan, harga, diskon)
            return baseRespone(
                data=result,
                message="Prediction successful",
                status_code=200
            )
        except RuntimeError as e:
            return errorRespone(
                message=str(e), 
                status_code=500
            )
        except Exception as e:
            return errorRespone(
                message=str(e), 
                status_code=500
            )