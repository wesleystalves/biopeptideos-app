from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    openai_api_key: str = ""
    redis_url: str = "redis://localhost:6379"
    nestjs_api_url: str = "http://biopeptidios-api.biopeptidios.svc.cluster.local:3001"
    nestjs_api_internal_key: str = ""
    default_model: str = "gpt-4o-mini"
    default_temperature: float = 0.7
    default_max_tokens: int = 500
    default_system_prompt: str = (
        "Você é um consultor especialista em peptídeos para performance e longevidade. "
        "Seu objetivo é ajudar o cliente a entender os benefícios dos peptídeos, "
        "tirar dúvidas com embasamento científico e, quando apropriado, "
        "guiá-lo para o produto ideal e concluir a venda. "
        "Seja amigável, profissional e direto. Nunca faça afirmações médicas definitivas."
    )
    default_welcome_message: str = (
        "Olá! Seja bem-vindo à BioPeptidios 🧬. "
        "Posso te ajudar a encontrar o peptídeo ideal para seus objetivos. "
        "O que você está buscando? Performance, recuperação, longevidade?"
    )

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
