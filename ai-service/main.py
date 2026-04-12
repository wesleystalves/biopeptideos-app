"""
BioPeptidios AI Service — FastAPI
Motor de IA para vendas multi-canal (WhatsApp, Telegram, Chat)
"""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from config import settings
from services import intent, state_machine, memory, ai, checkout

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🤖 BioPeptidios AI Service iniciando...")
    yield
    logger.info("AI Service encerrado.")


app = FastAPI(
    title="BioPeptidios AI Service",
    version="1.0.0",
    description="Motor de IA para vendas de peptídeos com detecção de intenção e state machine",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# === Schemas ===

class AIConfig(BaseModel):
    systemPrompt: Optional[str] = None
    temperature: Optional[float] = None
    maxTokens: Optional[int] = None
    model: Optional[str] = None
    welcomeMessage: Optional[str] = None

class ChatRequest(BaseModel):
    lead_id: str
    message: str
    channel: str = "whatsapp"
    country_code: str = "BR"
    product_id: Optional[str] = None
    config: Optional[AIConfig] = None

class ChatResponse(BaseModel):
    reply: str
    intent: str
    stage: str
    stage_changed: bool
    checkout_url: Optional[str] = None
    score_delta: int


# === Routes ===

@app.get("/health")
async def health():
    return {"status": "ok", "service": "biopeptidios-ai", "model": settings.default_model}


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    """
    Endpoint principal de chat com IA vendedora.

    Fluxo:
    1. Busca histórico e estado do lead no Redis
    2. Classifica intenção da mensagem
    3. Avança o estado da máquina de estados
    4. Gera resposta com OpenAI (prompt + histórico + contexto de estágio)
    5. Se CLOSING + BUY → gera link de checkout
    6. Salva mensagem no histórico
    7. Retorna resposta + metadados
    """
    # 1. Busca histórico e estado atual
    history = await memory.get_history(req.lead_id)
    current_stage = await memory.get_lead_state(req.lead_id)

    # 2. Classifica intenção
    detected_intent = intent.classify_intent(req.message)
    score_delta = state_machine.get_score_delta(detected_intent)

    # 3. Avança estado
    new_stage = state_machine.advance_state(current_stage, detected_intent)
    stage_changed = new_stage != current_stage
    if stage_changed:
        await memory.set_lead_state(req.lead_id, new_stage)
        logger.info(f"Lead {req.lead_id}: {current_stage} → {new_stage} (intent: {detected_intent})")

    # 4. Gera resposta com IA
    ai_config = req.config.model_dump() if req.config else None
    reply = await ai.generate_reply(
        history=history,
        user_message=req.message,
        lead_stage=new_stage,
        ai_config=ai_config,
    )

    # 5. Gera checkout se CLOSING e intenção de compra
    checkout_url = None
    if new_stage == "CLOSING" and detected_intent == "BUY":
        checkout_url = await checkout.generate_checkout_link(
            lead_id=req.lead_id,
            product_id=req.product_id,
            country_code=req.country_code,
            currency="BRL" if req.country_code == "BR" else "USD",
        )
        if checkout_url:
            reply += f"\n\n🛒 Aqui está seu link de compra:\n{checkout_url}"

    # 6. Salva no histórico
    await memory.save_message(req.lead_id, "user", req.message)
    await memory.save_message(req.lead_id, "assistant", reply)

    return ChatResponse(
        reply=reply,
        intent=detected_intent,
        stage=new_stage,
        stage_changed=stage_changed,
        checkout_url=checkout_url,
        score_delta=score_delta,
    )


@app.delete("/chat/{lead_id}")
async def clear_chat(lead_id: str):
    """Limpa histórico e estado do lead (ex: após venda ou reset)."""
    await memory.clear_history(lead_id)
    await memory.set_lead_state(lead_id, "NEW")
    return {"cleared": True, "lead_id": lead_id}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
