from pathlib import Path
import pandas as pd
from sqlalchemy.dialects.postgresql import insert
from database import SessionLocal
from models.sales_model import Sales

def seed_sales_from_csv():
    db = SessionLocal()
    try:
        base_dir = Path(__file__).resolve().parent
        csv_path = base_dir.parent / "data" / "sales_data.csv"
        
        if not Path(csv_path).exists():
            return {"success": False, "error": "File sales_data.csv tidak ditemukan"}

        df = pd.read_csv(csv_path)
        
        data_to_insert = []
        for _, row in df.iterrows():
            data_to_insert.append({
                "product_id": str(row["product_id"]).strip(),
                "product_name": row["product_name"],
                "jumlah_penjualan": int(row["jumlah_penjualan"]),
                "harga": float(row["harga"]),
                "diskon": float(row["diskon"]),
                "status": row["status"]
            })

        if data_to_insert:
            stmt = insert(Sales).values(data_to_insert)
            
            update_dict = {
                "product_name": stmt.excluded.product_name,
                "jumlah_penjualan": stmt.excluded.jumlah_penjualan,
                "harga": stmt.excluded.harga,
                "diskon": stmt.excluded.diskon,
                "status": stmt.excluded.status
            }

            upsert_stmt = stmt.on_conflict_do_update(
                index_elements=['product_id'], 
                set_=update_dict
            )
            
            db.execute(upsert_stmt)
            db.commit()

        return {
            "success": True, 
            "message": f"Berhasil memproses {len(data_to_insert)} baris data (Insert/Update)."
        }

    except Exception as e:
        db.rollback()
        return {"success": False, "error": str(e)}
    finally:
        db.close()