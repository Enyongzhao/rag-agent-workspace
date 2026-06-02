from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

from sqlalchemy.orm import Session

from backend.core.database import get_db
from backend.core.security import verify_token
from backend.models.user import User


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/auth/login"
)


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):

    email = verify_token(token)

    if email is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Could not validate credentials"
        )

    return user
