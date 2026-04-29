from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from database import Base


class Sales(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    product_id = Column(String, unique=True, nullable=False)
    product_name = Column(String, nullable=False)
    jumlah_penjualan = Column(Integer, nullable=False)
    harga = Column(Integer, nullable=False)
    diskon = Column(Integer, nullable=False)
    status = Column(String, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
