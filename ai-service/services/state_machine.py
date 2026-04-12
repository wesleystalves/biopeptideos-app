"""
Lead State Machine
Gerencia a evolução do estágio do lead baseado nas interações.

States: NEW → ENGAGED → QUALIFIED → CLOSING → WON | LOST
"""

# Matriz de transições: estado_atual + intenção → próximo_estado
TRANSITIONS = {
    ("NEW", "GREETING"):   "ENGAGED",
    ("NEW", "CURIOUS"):    "ENGAGED",
    ("NEW", "DOUBT"):      "ENGAGED",
    ("NEW", "PRICE"):      "QUALIFIED",
    ("NEW", "BUY"):        "CLOSING",

    ("ENGAGED", "DOUBT"):      "ENGAGED",
    ("ENGAGED", "CURIOUS"):    "ENGAGED",
    ("ENGAGED", "PRICE"):      "QUALIFIED",
    ("ENGAGED", "BUY"):        "CLOSING",
    ("ENGAGED", "OBJECTION"):  "ENGAGED",  # Continua engajado, tenta contornar

    ("QUALIFIED", "PRICE"):     "QUALIFIED",
    ("QUALIFIED", "DOUBT"):     "QUALIFIED",
    ("QUALIFIED", "BUY"):       "CLOSING",
    ("QUALIFIED", "OBJECTION"): "QUALIFIED",  # Tenta contornar objeção

    ("CLOSING", "BUY"):       "WON",
    ("CLOSING", "OBJECTION"): "QUALIFIED",  # Retrocede para qualificação
    ("CLOSING", "DOUBT"):     "CLOSING",
}

# Score acumulado por intenção
SCORE_BY_INTENT = {
    "BUY": 20,
    "PRICE": 10,
    "DOUBT": 5,
    "CURIOUS": 5,
    "OBJECTION": -5,
    "GREETING": 2,
    "OTHER": 0,
}


def advance_state(current_state: str, intent: str) -> str:
    """Avança o estado do lead com base na intenção detectada."""
    current_state = current_state.upper()
    intent = intent.upper()

    if current_state in ("WON", "LOST"):
        return current_state

    key = (current_state, intent)
    return TRANSITIONS.get(key, current_state)


def get_score_delta(intent: str) -> int:
    """Retorna o delta de score para a intenção detectada."""
    return SCORE_BY_INTENT.get(intent.upper(), 0)


def get_stage_guidance(state: str) -> str:
    """Retorna instrução adicional de sistema para o estágio atual."""
    guidance = {
        "NEW": "O lead acabou de chegar. Seja acolhedor e descubra o objetivo principal.",
        "ENGAGED": "O lead está engajado. Aprofunde as necessidades e apresente benefícios relevantes.",
        "QUALIFIED": "Lead qualificado e interessado em preço. Apresente a proposta com clareza e urgência.",
        "CLOSING": "Lead pronto para comprar! Envie o link de checkout IMEDIATAMENTE. Não perca o momento.",
        "WON": "Venda fechada! Confirme a compra e oriente sobre entrega e próximos passos.",
        "LOST": "Lead perdido. Se retornar, comece como ENGAGED.",
    }
    return guidance.get(state.upper(), "")
