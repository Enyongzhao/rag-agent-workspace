from redis.asyncio import Redis

from backend.core.config import settings


redis_client = Redis.from_url(
    settings.redis_url,
    decode_responses=True,
)


async def ping_redis() -> bool:
    return await redis_client.ping()


async def set_session(
    session_id: str,
    user_email: str,
    ttl_seconds: int,
) -> None:
    await redis_client.set(
        f"session:{session_id}",
        user_email,
        ex=ttl_seconds,
    )


async def get_session(session_id: str) -> str | None:
    return await redis_client.get(f"session:{session_id}")


async def hit_rate_limit(
    key: str,
    limit: int,
    window_seconds: int,
) -> bool:
    current_count = await redis_client.incr(key)

    if current_count == 1:
        await redis_client.expire(key, window_seconds)

    return current_count > limit
