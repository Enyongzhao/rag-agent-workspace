from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import Request

from sqlalchemy.orm import Session
from uuid import uuid4

from backend.core.database import get_db

from backend.core.security import (
    hash_password,
    verify_password,
    create_access_token
)
from backend.core.redis import (
    hit_rate_limit,
    set_session,
)
from backend.core.config import settings

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
    request: Request,
    user: UserLogin,
    db: Session = Depends(get_db)
):
    client_host = request.client.host if request.client else "unknown"
    is_limited = await hit_rate_limit(
        key=f"rate:login:{client_host}",
        limit=5,
        window_seconds=60,
    )

    if is_limited:
        raise HTTPException(
            status_code=429,
            detail="Too many login attempts. Please try again later."
        )

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

    session_id = str(uuid4())

    token = create_access_token(
        {
            "sub": db_user.email,
            "jti": session_id,
        }
    )

    await set_session(
        session_id=session_id,
        user_email=db_user.email,
        ttl_seconds=settings.access_token_expire_minutes * 60,
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
