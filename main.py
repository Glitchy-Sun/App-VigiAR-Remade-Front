from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.db.database import init_db
from app.api import auth, agendamento, focos

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Iniciando conexão com o MongoDB...")
    await init_db()
    print("Conectado com sucesso!")
    yield
    print("Desligando API...")

app = FastAPI(title="API APP-ECOVETOR", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(focos.router, prefix="/api/focos", tags=["focos"])
app.include_router(auth.router, prefix="/api") 
# LINHA CORRIGIDA: Agora a API reconhece as rotas de tarefas do Secretário!
app.include_router(agendamento.router, prefix="/api") 

@app.get("/")
def read_root():
    return {"status": "API rodando com MongoDB e Beanie!"}