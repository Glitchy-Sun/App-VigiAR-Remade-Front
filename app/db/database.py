import os
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from dotenv import load_dotenv, find_dotenv 
from app.core.config import settings
from app.models.agente import Agente
from app.models.foco import Foco
from typing import Any, cast

load_dotenv(find_dotenv())

async def init_db():
    database_url = None
    
    # 1. Tenta obter a URL através das configurações padrões do app (settings)
    try:
        database_url = settings.DATABASE_URL
    except Exception:
        pass

    # 2. SE o settings estiver vazio ou falhar, busca diretamente das variáveis de ambiente.
    # Isso vai ler perfeitamente o seu .env local ou a variável criada no Render!
    if not database_url:
        database_url = os.getenv("MONGO_URI") or os.getenv("DATABASE_URL")
        
    # 3. Validação caso nenhuma configuração seja encontrada (evita travar com erro gigante)
    if not database_url:
        raise ValueError(
            "ERRO: A URL de conexão com o MongoDB não foi encontrada!\n"
            "Certifique-se de definir 'MONGO_URI' ou 'DATABASE_URL' no seu arquivo .env ou no painel do Render."
        )

    # Cria o cliente do MongoDB usando a URL configurada
    client = AsyncIOMotorClient(database_url)
    
    # Tentamos obter o banco de dados padrão definido na própria URL do Mongo
    try:
        database = client.get_default_database()
        # Se retornar o banco padrão do mongo ('test'), redirecionamos para o seu
        if database is None or database.name == "test":
            database = client.app_ecovetor
    except Exception:
        database = client.app_ecovetor
    
    # Inicializa o Beanie mapeando os modelos corretos ('Agente' e 'Foco')
    await init_beanie(
        database=cast(Any, database),
        document_models=[Agente, Foco]
    )