from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from models.sales_model import Sales

class SalesRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, skip: int = 0, limit: int = 10) -> List[Sales]:
        return self.db.query(Sales).offset(skip).limit(limit).all()

    def get_by_id(self, sales_id: int) -> Optional[Sales]:
        return self.db.query(Sales).filter(Sales.id == sales_id).first()

    def get_by_product_id(self, product_id: str) -> Optional[Sales]:
        return self.db.query(Sales).filter(Sales.product_id == product_id).first()

    def create(self, sales_data: dict) -> Sales:

        db_sales = Sales(**sales_data)
        self.db.add(db_sales)
        self.db.commit()
        self.db.refresh(db_sales) 
        return db_sales

    def update(self, sales_id: int, update_data: dict) -> Optional[Sales]:
        db_sales = self.get_by_id(sales_id)
        if not db_sales:
            return None

        for key, value in update_data.items():
            setattr(db_sales, key, value)
            
        self.db.commit()
        self.db.refresh(db_sales)
        return db_sales

    def delete(self, sales_id: int) -> bool:
        db_sales = self.get_by_id(sales_id)
        if not db_sales:
            return False
            
        self.db.delete(db_sales)
        self.db.commit()
        return True