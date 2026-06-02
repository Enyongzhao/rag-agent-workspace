from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from backend.core.database import get_db

from backend.core.security import (
    hash_password,
    verify_password,
    create_access_token
)

from backend.models.user import User

from backend.schemas.user import (
    UserCreate,
    UserLogin,
    UserRead,
    Token,
    MessageResponse
)

from backend.dependencies.auth import (
    get_current_user
)


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


@router.post(
    "/register",
    response_model=MessageResponse
)
async def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    existing_email = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    existing_username = (
        db.query(User)
        .filter(User.username == user.username)
        .first()
    )

    if existing_username:
        raise HTTPException(
            status_code=400,
            detail="Username already registered"
        )

    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(
            user.password
        )
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return {
        "message": "User created"
    }


@router.post(
    "/login",
    response_model=Token
)
async def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    db_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Could not validate credentials"
        )

    if not verify_password(
        user.password,
        db_user.hashed_password
    ):
        raise HTTPException(
            status_code=401,
            detail="Could not validate credentials"
        )

    token = create_access_token(
        {
            "sub": db_user.email
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@router.get(
    "/me",
    response_model=UserRead
)
async def get_me(
    current_user: User = Depends(
        get_current_user
    )
):
    return current_user
