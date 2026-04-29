from repository.sales_repo import SalesRepository
from services.sales_service import SalesService
from handlers.sales_handler import SalesHandler
from database import SessionLocal

from repository.users_repo import UsersRepository
from services.users_service import UsersService
from services.auth_service import AuthService
from handlers.auth_handler import AuthHandler

from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends,Security,HTTPException,status

security = HTTPBearer()
def get_users_repository():
    db = SessionLocal()
    return UsersRepository(db)


def get_auth_service(
    repo: UsersRepository = Depends(get_users_repository)
):
    return AuthService(repo)


def get_auth_handler(
    service: AuthService = Depends(get_auth_service)
):
    return AuthHandler(service)


def get_sales_repository():
    db = SessionLocal()
    return SalesRepository(db)


def get_sales_service(
    repo: SalesRepository = Depends(get_sales_repository)
):
    return SalesService(repo)


def get_sales_handler(
    service: SalesService = Depends(get_sales_service)
):
    return SalesHandler(service)

def require_jwt(
    credentials: HTTPAuthorizationCredentials = Security(security),
    auth_service: AuthService = Depends(get_auth_service)
):
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized. JWT Token missing in Header." 
        )

    token_string = credentials.credentials
    return auth_service.verif_jwt(token_string)