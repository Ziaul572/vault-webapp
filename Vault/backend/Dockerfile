FROM python:3.12-slim

RUN mkdir /app /app/storage
WORKDIR /app
 
ENV PYTHONPATH="${PYTHONPATH}:/app"
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update -y \
    && apt-get install -y \
        build-essential \
        pkg-config \
        python3-dev \
        libjpeg-dev \
        zlib1g-dev \
        libfreetype6-dev \
        libpq-dev \
        libmagic1 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt  /app/
RUN pip install --no-cache-dir -r requirements.txt
COPY . /app/

# Project specific configuration
ENV DJANGO_SUPERUSER_USERNAME "admin"
ENV DJANGO_SUPERUSER_PASSWORD "admin"
ENV DJANGO_SUPERUSER_EMAIL "admin@localhost"
ENV DATABASE_URL "sqlite:////app/storage/db.sqlite3"
 
EXPOSE 8000

CMD ["sh", "/app/docker_entrypoint.sh"]