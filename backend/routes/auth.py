from fastapi import APIRouter, Depends
from pydantic import BaseModel

from handlers.auth_handler import AuthHandler
from dependencies import get_auth_handler


router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/login")
def login(
    payload: LoginRequest,
    handler: AuthHandler = Depends(get_auth_handler)
):
    """
    Login user
    """
    return handler.login(payload.email, payload.password)   