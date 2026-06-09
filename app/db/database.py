import os
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings
from app.models.agente import Agente
from app.models.foco import Foco
from typing import Any, cast

async def init_db():
    # Coleta a URL de forma segura do Config do app ou direto do ambiente (Render)
    database_url = getattr(settings, "DATABASE_URL", None) or os.getenv("MONGO_URI") or os.getenv("DATABASE_URL")
    
    if not database_url:
        raise ValueError(
            "ERRO: A URL de conexão com o MongoDB não foi encontrada!\n"
            "Certifique-se de definir 'DATABASE_URL' ou 'MONGO_URI' no seu arquivo .env ou no Render."
        )

    # Configuração de segurança para evitar rejeição de SSL pelo Windows ou provedor de Internet
    client_kwargs = {}
    try:
        import certifi
        client_kwargs["tlsCAFile"] = certifi.where()
    except ImportError:
        # Se o pacote certifi não estiver instalado, segue sem ele
        pass

    # Cria o cliente do MongoDB usando a URL configurada e os parâmetros TLS/SSL adicionais
    client = AsyncIOMotorClient(database_url, **client_kwargs)
    
    try:
        database = client.get_default_database()
        if database is None or database.name == "test":
            database = client.app_ecovetor
    except Exception:
        database = client.app_ecovetor
    
    # Inicializa o Beanie mapeando os modelos corretos ('Agente' e 'Foco')
    await init_beanie(
        database=cast(Any, database),
        document_models=[Agente, Foco]
    )