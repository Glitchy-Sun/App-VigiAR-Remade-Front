from pydantic import BaseModel

class LoginSchema(BaseModel):
    matricula: str
    password: str

class RegisterSchema(BaseModel):
    matricula: str
    nome: str
    password: str