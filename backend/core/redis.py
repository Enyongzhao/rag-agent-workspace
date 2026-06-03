from redis.asyncio import Redis

from backend.core.config import settings


redis_client = Redis.from_url(
    settings.redis_url,
    decode_responses=True,
)


async def ping_redis() -> bool:
    return await redis_client.ping()
