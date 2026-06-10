from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from sqlalchemy.orm import Session

from backend.core.database import get_db
from backend.core.redis import get_session
from backend.core.security import decode_access_token
from backend.models.user import User


bearer_scheme = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
):
    token = credentials.credentials

    payload = decode_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    email: str | None = payload.get("sub")
    session_id: str | None = payload.get("jti")

    if email is None or session_id is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    session_email = await get_session(session_id)

    if session_email != email:
        raise HTTPException(
            status_code=401,
            detail="Session expired"
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


async def get_current_admin_user(
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    return current_user