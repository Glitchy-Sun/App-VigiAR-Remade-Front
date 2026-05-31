import os
from pathlib import Path


def load_dotenv(path: str = ".env") -> None:
    env_path = Path(path)
    if not env_path.exists():
        return

    with env_path.open() as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue

            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            if key and key not in os.environ:
                os.environ[key] = value


load_dotenv()

class Settings:
    PROJECT_NAME: str = "API APP-ECOVETOR"
    # URL padrão do MongoDB local caso não ache no .env
    DATABASE_URL: str = os.getenv("DATABASE_URL", "mongodb://localhost:27017")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "chave-super-secreta-mudar-depois")

settings = Settings()
