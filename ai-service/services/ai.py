"""
AI Service — Integração com OpenAI
Gera respostas usando GPT com o histórico de conversa e o contexto do estágio do lead.
"""
from openai import AsyncOpenAI
from config import settings
from services.state_machine import get_stage_guidance


async def generate_reply(
    history: list[dict],
    user_message: str,
    lead_stage: str,
    ai_config: dict | None = None,
) -> str:
    """
    Gera resposta da IA usando OpenAI.

    Args:
        history: Histórico de mensagens (role/content)
        user_message: Mensagem atual do usuário
        lead_stage: Estágio atual do lead (NEW, ENGAGED, QUALIFIED, CLOSING, WON)
        ai_config: Configuração da IA do banco (prompt, temperatura, modelo)

    Returns:
        Texto da resposta gerada
    """
    cfg = ai_config or {}
    api_key = settings.openai_api_key

    if not api_key:
        return cfg.get("welcomeMessage") or settings.default_welcome_message

    client = AsyncOpenAI(api_key=api_key)

    # Monta system prompt com contexto de venda
    system_prompt = cfg.get("systemPrompt") or settings.default_system_prompt
    stage_guidance = get_stage_guidance(lead_stage)

    full_system = (
        f"{system_prompt}\n\n"
        f"=== ESTÁGIO ATUAL DO LEAD: {lead_stage} ===\n"
        f"{stage_guidance}"
    )

    # Monta as mensagens para a API
    messages = [{"role": "system", "content": full_system}]
    messages.extend(history)  # histórico anterior
    messages.append({"role": "user", "content": user_message})

    try:
        response = await client.chat.completions.create(
            model=cfg.get("model") or settings.default_model,
            temperature=cfg.get("temperature") or settings.default_temperature,
            max_tokens=cfg.get("maxTokens") or settings.default_max_tokens,
            messages=messages,  # type: ignore
        )
        return response.choices[0].message.content or ""
    except Exception as e:
        return f"Desculpe, ocorreu um erro temporário. Tente novamente em instantes."
