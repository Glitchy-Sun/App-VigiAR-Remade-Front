from pydantic import BaseModel
from typing import List, Optional

class ItemVisitaSchema(BaseModel):
    client_id: str
    status: str
    focos: List[str]
    coordenadas: Optional[List[float]] = None
    setor_manual: Optional[str] = None
    gps_disponivel: bool
    observacoes: Optional[str] = None
    registrado_em: str