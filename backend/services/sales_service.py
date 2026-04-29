from repository.sales_repo import SalesRepository
from typing import List, Optional

class SalesService:
    def __init__(self, repo: SalesRepository):
        self.repo = repo

    def checkSeedIsValid(self):
        data = self.repo.get_all()
        if data:
            return False
        return True

    def get_all_sales(self):
        return self.repo.get_all()
        