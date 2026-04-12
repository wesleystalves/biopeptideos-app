"""
Checkout Service — Gera link de checkout via NestJS PaymentRouter
Chamado quando o lead está em estágio CLOSING com intenção BUY
"""
import httpx
from config import settings


async def generate_checkout_link(
    lead_id: str,
    product_id: str | None = None,
    country_code: str = "BR",
    currency: str = "BRL",
) -> str | None:
    """
    Solicita ao NestJS a criação de um link de checkout para o lead.
    Retorna a URL de pagamento ou None se falhar.
    """
    if not settings.nestjs_api_url:
        return None

    payload = {
        "profileId": lead_id,
        "productId": product_id or "default",
        "countryCode": country_code,
        "currency": currency,
        "gateway": "stripe" if country_code != "BR" else "asaas",
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            res = await client.post(
                f"{settings.nestjs_api_url}/api/payments/checkout",
                json=payload,
                headers={"x-internal-key": settings.nestjs_api_internal_key},
            )
            if res.status_code == 201:
                data = res.json()
                return data.get("paymentUrl") or data.get("url")
    except Exception:
        pass

    return None
