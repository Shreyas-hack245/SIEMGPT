import os
from pydantic import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SIEMGPT Enterprise"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api/v1"

    # Auth
    SECRET_KEY: str = os.getenv(
        "SECRET_KEY",
        "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7",
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Threat intelligence
    ABUSEIPDB_API_KEY: str = os.getenv("ABUSEIPDB_API_KEY", "")
    VIRUSTOTAL_API_KEY: str = os.getenv("VIRUSTOTAL_API_KEY", "")

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./siemgpt.db",
    )

settings = Settings()
