from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from routes.sales_route import router as sales_router

load_dotenv()

def create_app():
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

    app.include_router(sales_router)

    @app.get("/")
    def root():
        return {
            "success": True,
            "message": "API is running"
        }

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