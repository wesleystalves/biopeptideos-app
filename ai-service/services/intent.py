"""
Intent Classification Service
Classifica a intenção da mensagem do usuário:
BUY | DOUBT | PRICE | OBJECTION | CURIOUS | GREETING | OTHER
"""
import re

# Palavras-chave por intenção (português + inglês)
INTENT_PATTERNS = {
    "BUY": [
        r"quero comprar", r"como compro", r"onde compro", r"quanto custa", r"preço",
        r"quero pedir", r"fazer pedido", r"adicionar ao carrinho", r"checkout",
        r"i want to buy", r"how to order", r"purchase", r"buy now",
        r"vou comprar", r"me passa o link", r"link de compra", r"pix",
    ],
    "PRICE": [
        r"qual.*preço", r"quanto.*custa", r"valor", r"custo", r"price",
        r"quanto é", r"caro", r"barato", r"desconto", r"promoção",
        r"how much", r"cost", r"pricing",
    ],
    "DOUBT": [
        r"o que é", r"para que serve", r"como funciona", r"o que faz",
        r"what is", r"how does", r"tell me about", r"explain",
        r"efeito", r"benefício", r"resultado", r"funciona mesmo",
        r"é seguro", r"safe", r"dúvida", r"pergunta",
    ],
    "OBJECTION": [
        r"muito caro", r"não.*dinheiro", r"sem.*grana", r"depois",
        r"vou pensar", r"não sei", r"não tenho certeza", r"talvez",
        r"too expensive", r"maybe later", r"i'll think",
        r"frete", r"demora", r"entrega rápida",
    ],
    "CURIOUS": [
        r"me fala mais", r"conta mais", r"interessante", r"curioso",
        r"quero saber", r"tell me more", r"interested", r"curious",
        r"pesquisando", r"estou vendo", r"comparando",
    ],
    "GREETING": [
        r"^oi$", r"^olá$", r"^hello$", r"^hi$", r"bom dia",
        r"boa tarde", r"boa noite", r"tudo bem", r"tudo bom",
    ],
}


def classify_intent(message: str) -> str:
    """Classifica a intenção da mensagem."""
    text = message.lower().strip()

    for intent, patterns in INTENT_PATTERNS.items():
        for pattern in patterns:
            if re.search(pattern, text):
                return intent

    return "OTHER"
