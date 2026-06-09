from dotenv import load_dotenv, find_dotenv
# OBRIGATÓRIO: Carrega o arquivo .env antes de carregar qualquer estrutura do app
load_dotenv(find_dotenv())

from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.db.database import init_db
from app.api import focos 

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Iniciando conexão com o MongoDB...")
    await init_db() 
    print("Conectado com sucesso!")
    yield
    print("Desligando API...")

app = FastAPI(title="API APP-ECOVETOR", lifespan=lifespan)

# Incluindo suas rotas de focos
app.include_router(focos.router, prefix="/api/focos", tags=["focos"])

@app.get("/")
def read_root():
    return {"status": "API rodando com MongoDB e Beanie!"}