from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class GeoJsonPoint(BaseModel):
    type: str = "Point"
    coordinates: List[float] = Field(..., description="Coordenadas no formato [longitude, latitude]")

class FocoBase(BaseModel):
    status: str = Field(..., description="Status da visita (ex: 'visitada', 'fechada')")
    focos: List[str] = Field(default_factory=list, description="Lista de criadouros encontrados (ex: ['pneu', 'lixo'])")
    gps_disponivel: bool = True
    registrado_em: datetime = Field(default_factory=datetime.utcnow)

class FocoCreate(FocoBase):
    """Schema para quando recebemos um novo foco do mobile/frontend (Fila de Sincronização)"""
    location: GeoJsonPoint

class FocoResponse(FocoBase):
    """Schema para quando enviamos os dados do banco de volta para o cliente (Seguro e limpo)"""
    id: str = Field(..., description="ID hexadecimal do registro no MongoDB")
    location: GeoJsonPoint
    agente_id: Optional[str] = None

    class Config:
        # Permite que o Pydantic leia os dados direto do modelo do Beanie/MongoDB
        from_attributes = True