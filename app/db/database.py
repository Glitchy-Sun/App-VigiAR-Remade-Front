from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from dotenv import load_dotenv
from app.core.config import settings
from app.models.agente import Agente
from app.models.foco import Foco
from typing import Any, cast

# Garante que as variáveis do arquivo .env sejam carregadas antes de qualquer outra configuração
load_dotenv()

async def init_db():
    # Cria o cliente do MongoDB usando a URL configurada
    client = AsyncIOMotorClient(settings.DATABASE_URL)
    
    # Tentamos obter o banco de dados padrão definido na própria URL do Mongo (ex: mongodb://localhost:27017/ecovetor)
    # Se não houver nenhum especificado na URL, ele usará o 'app_ecovetor' por padrão.
    try:
        database = client.get_default_database()
    except Exception:
        database = client.app_ecovetor
    
    # Inicializa o Beanie mapeando os modelos corretos ('Agente' e 'Foco')
    # mypy/IDE type checkers may complain about Motor's database type; cast to Any to satisfy signatures
    await init_beanie(
        database=cast(Any, database),
        document_models=[Agente, Foco]
    )