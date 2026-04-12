"""
Memory Service — Histórico de conversa com TTL no Redis
Cada lead_id tem um histórico de mensagens com ExpiresIn configurável (default: 24h)
"""
import json
from typing import Optional
import redis.asyncio as aioredis
from config import settings

TTL_SECONDS = 86400  # 24 horas
MAX_HISTORY = 20     # Máximo de mensagens no contexto (evitar tokens excessivos)

_redis: Optional[aioredis.Redis] = None


async def get_redis() -> aioredis.Redis:
    global _redis
    if _redis is None:
        _redis = aioredis.from_url(
            settings.redis_url,
            encoding="utf-8",
            decode_responses=True,
        )
    return _redis


def _key(lead_id: str) -> str:
    return f"biopeptidios:chat:{lead_id}"


async def get_history(lead_id: str) -> list[dict]:
    """Retorna o histórico de mensagens do lead."""
    try:
        r = await get_redis()
        raw = await r.get(_key(lead_id))
        if not raw:
            return []
        return json.loads(raw)
    except Exception:
        return []


async def save_message(lead_id: str, role: str, content: str) -> None:
    """Adiciona uma mensagem ao histórico e reseta o TTL."""
    try:
        r = await get_redis()
        history = await get_history(lead_id)
        history.append({"role": role, "content": content})
        # Mantém apenas as últimas MAX_HISTORY mensagens
        if len(history) > MAX_HISTORY:
            history = history[-MAX_HISTORY:]
        await r.setex(_key(lead_id), TTL_SECONDS, json.dumps(history))
    except Exception:
        pass  # Falha silenciosa: sem Redis, ainda funciona sem contexto


async def clear_history(lead_id: str) -> None:
    """Limpa o histórico do lead (ex: após venda fechada)."""
    try:
        r = await get_redis()
        await r.delete(_key(lead_id))
    except Exception:
        pass


async def get_lead_state(lead_id: str) -> str:
    """Retorna o estado atual do lead armazenado no Redis."""
    try:
        r = await get_redis()
        state = await r.get(f"biopeptidios:state:{lead_id}")
        return state or "NEW"
    except Exception:
        return "NEW"


async def set_lead_state(lead_id: str, state: str) -> None:
    """Salva o estado do lead no Redis (TTL de 7 dias)."""
    try:
        r = await get_redis()
        await r.setex(f"biopeptidios:state:{lead_id}", 604800, state)
    except Exception:
        pass
