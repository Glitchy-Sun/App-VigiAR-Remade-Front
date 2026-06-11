from pydantic import BaseModel
from typing import Optional

class LoginSchema(BaseModel):
    matricula: str
    password: str
    tipo: str  # "agente" ou "secretario"

class RegisterSchema(BaseModel):
    matricula: str
    nome: str
    password: str
    tipo: str  # "agente" ou "secretario"
    foto_base64: str  # Obrigatória no payload de cadastro