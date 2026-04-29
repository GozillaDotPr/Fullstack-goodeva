from fastapi import APIRouter

router = APIRouter(
    prefix="/sales",
    tags=["Sales"]
)


@router.get("/")
def get_sales():
    return {
        "data": [
            {
                "product": "Product A",
                "sales": 100
            },
            {
                "product": "Product B",
                "sales": 50
            }
        ]
    }

