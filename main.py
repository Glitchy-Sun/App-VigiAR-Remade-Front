from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.db.database import init_db
from app.api import focos, auth  # Importando o auth.py da pasta api

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Iniciando conexão com o MongoDB...")
    await init_db() 
    print("Conectado com sucesso!")
    yield
    print("Desligando API...")

app = FastAPI(title="API APP-ECOVETOR", lifespan=lifespan)

# Libera a comunicação do Front-end (HTML/JS) com o Back-end (Python)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite que qualquer porta local (como o 5500 do Live Server) acesse
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluindo as rotas (o auth já tem prefixo interno, então incluímos com /api)
app.include_router(focos.router, prefix="/api/focos", tags=["focos"])
app.include_router(auth.router, prefix="/api") 

@app.get("/")
def read_root():
    return {"status": "API rodando com MongoDB e Beanie!"}