from fastapi import APIRouter, Query
from app.models.foco import Foco
from app.api.schemas.foco import FocoResponse  # <-- Importamos o novo Schema aqui
from typing import List

router = APIRouter(prefix="/focos", tags=["Focos"])

@router.get("/proximos", response_model=List[FocoResponse]) # <-- Mudamos para usar o Schema de resposta
async def get_focos_proximos(
    lat: float = Query(..., description="Latitude atual do agente"),
    long: float = Query(..., description="Longitude atual do agente"),
    raio: int = Query(5000, description="Raio de busca em metros (padrão: 5km)")
):
    # Busca utilizando o índice espacial 2dsphere do MongoDB
    focos = await Foco.find({
        "location": {
            "$nearSphere": {
                "$geometry": {
                    "type": "Point",
                    "coordinates": [long, lat] # MongoDB usa [Longitude, Latitude]
                },
                "$maxDistance": raio
            }
        }
    }).to_list()
    
    return focos