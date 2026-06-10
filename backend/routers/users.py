from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.core.database import get_db
from backend.dependencies.auth import get_current_admin_user
from backend.models.user import User
from backend.schemas.user import (
    UserAdminCreate,
    UserAdminUpdate,
    UserRead,
)
from backend.core.security import hash_password

router = APIRouter(
    prefix="/api/users",
    tags=["Users"],
)

VALID_USER_ROLES = {"user", "admin"}


@router.get(
    "",
    response_model=list[UserRead],
)
async def list_users(
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    users = (
        db.query(User)
        .order_by(User.id.asc())
        .all()
    )

    return users


@router.post(
    "",
    response_model=UserRead,
)
async def create_user(
    user: UserAdminCreate,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
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

    if user.role not in VALID_USER_ROLES:
        raise HTTPException(
            status_code=400,
            detail="Invalid role"
        )
    
    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password),
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.patch(
    "/{user_id}",
    response_model=UserRead,
)
async def update_user(
    user_id: int,
    user_data: UserAdminUpdate,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    db_user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    if user_data.email is not None:
        existing_email = (
            db.query(User)
            .filter(User.email == user_data.email)
            .filter(User.id != user_id)
            .first()
        )
    
        if existing_email:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )

        db_user.email = user_data.email

    if user_data.username is not None:
        existing_username = (
            db.query(User)
            .filter(User.username == user_data.username)
            .filter(User.id != user_id)
            .first()
        )

        if existing_username:
            raise HTTPException(
                status_code=400,
                detail="Username already registered"
            )

        db_user.username = user_data.username

    if user_data.password is not None:
        db_user.hashed_password = hash_password(user_data.password)

    if user_data.role is not None:
        if user_data.role not in VALID_USER_ROLES:
            raise HTTPException(
                status_code=400,
                detail="Invalid role"
            )

        db_user.role = user_data.role

    db.commit()
    db.refresh(db_user)

    return db_user


@router.delete(
    "/{user_id}",
    status_code=204,
)
async def delete_user(
    user_id: int,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    db_user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if db_user.id == current_admin.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot delete yourself"
        )

    db.delete(db_user)
    db.commit()
