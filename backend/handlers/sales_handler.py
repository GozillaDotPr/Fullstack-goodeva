from services.sales_service import SalesService
from dto.respone import baseRespone
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