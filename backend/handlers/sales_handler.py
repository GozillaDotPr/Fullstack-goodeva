from services.sales_service import SalesService

class SalesHandler:
    def __init__(self, service: SalesService):
        self.service = service
    
    def get_all_sales(self):
        return self.service.get_all_sales()
    