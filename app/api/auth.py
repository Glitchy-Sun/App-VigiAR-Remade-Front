from fastapi import APIRouter, HTTPException, status
from app.api.schemas.auth import LoginSchema, RegisterSchema
# Se houver um modelo Agente criado em app.models.agente, você o importaria aqui

router = APIRouter(prefix="/auth", tags=["Autenticação"])

@router.post("/login")
async def login(payload: LoginSchema):
    # Simulação de validação (Substitua pela busca real no MongoDB depois)
    if payload.matricula == "1234" and payload.password == "senha123":
        return {
            "user": {
                "matricula": payload.matricula,
                "nome": "Agente VigiAr"
            }
        }
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Matrícula ou senha incorretas."
    )

@router.post("/register")
async def register(payload: RegisterSchema):
    # Aqui você salvaria o agente no banco usando Beanie:
    # novo_agente = Agente(matricula=payload.matricula, nome=payload.nome...)
    # await novo_agente.insert()
    return {"message": "Cadastro realizado com sucesso!"}