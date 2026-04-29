from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from sqlalchemy import text
from database import engine, SessionLocal
from seed import seed_sales_from_csv
import os

from repository.sales_repo import SalesRepository
from services.sales_service import SalesService


from routes.sales_route import router as sales_router

load_dotenv()

def create_app():
    # init services repo hand handler
    db = SessionLocal()
    sales_repo = SalesRepository(db)
    sales_service = SalesService(sales_repo)

    app = FastAPI(
        title="Mini AI Sales Prediction API",
        description="API for managing sales data and predicting product sales status",
        version="1.0.0"
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(sales_router,prefix="/api/v1")

    @app.get("/")
    def root():
        return {
            "success": True,
            "message": "API is running"
        }

    @app.on_event("startup")
    async def startup():
        try:
            with engine.connect() as connection:
                connection.execute(text("SELECT 1"))

            print("Database connected successfully")

            if sales_service.checkSeedIsValid():
                result = seed_sales_from_csv()
                print(f"Seed result: {result}")
            else:
                print("Seed already exists")

        except Exception as e:
            print(f"Database connection failed: {e}")
            raise e 

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": "Internal server error",
                "error": str(exc)
            }
        )

    return app


app = create_app()