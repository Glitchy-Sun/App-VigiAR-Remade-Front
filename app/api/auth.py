from fastapi import APIRouter, HTTPException, status
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta

from app.core.config import settings
from app.models.agente import Agente
from app.api.schemas.auth import LoginSchema, RegisterSchema

# O router já tem o prefixo /auth, então a rota final será /api/auth/login
router = APIRouter(prefix="/auth", tags=["Autenticação"])

# Motor de criptografia
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/login")
async def login(payload: LoginSchema):
    # 1. Busca no MongoDB pela matrícula
    agente = await Agente.find_one(Agente.matricula == payload.matricula)
    
    # 2. Valida se o agente existe e se a senha descriptografada bate
    if not agente or not pwd_context.verify(payload.password, agente.senha_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Matrícula ou senha incorretas."
        )
    
    # 3. Criação do Token de Segurança JWT
    tempo_expiracao = datetime.utcnow() + timedelta(hours=8)
    token_data = {"sub": agente.matricula, "exp": tempo_expiracao}
    access_token = jwt.encode(token_data, settings.SECRET_KEY, algorithm="HS256")
    
    # 4. Retorna o token e o usuário (exatamente como seu JS pede)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "matricula": agente.matricula,
            "nome": agente.nome
        }
    }

@router.post("/register")
async def register(payload: RegisterSchema):
    # 1. Verifica se a matrícula já existe no banco
    if await Agente.find_one(Agente.matricula == payload.matricula):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Esta matrícula já está cadastrada no sistema!"
        )
    
    # 2. Criptografa a senha do agente
    senha_criptografada = pwd_context.hash(payload.password)
    
    # 3. Cria e insere o agente no MongoDB
    novo_agente = Agente(
        nome=payload.nome,
        matricula=payload.matricula,
        senha_hash=senha_criptografada
    )
    await novo_agente.insert()
    
    return {"message": "Cadastro realizado com sucesso!"}