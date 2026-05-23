"""
Legacy config - import from settings instead
"""
from app.core.settings import settings

# Re-export for backward compatibility
PROJECT_NAME = settings.PROJECT_NAME
VERSION = settings.VERSION
API_V1_STR = settings.API_V1_STR
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES
DATABASE_URL = settings.DATABASE_URL
ABUSEIPDB_API_KEY = settings.ABUSEIPDB_API_KEY
VIRUSTOTAL_API_KEY = settings.VIRUSTOTAL_API_KEY

