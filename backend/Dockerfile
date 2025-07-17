FROM python:3.9-slim

# Install system-level dependencies for psycopg2
RUN apt-get update \
 && apt-get install -y gcc libpq-dev \
 && pip install psycopg2 \
 && apt-get purge -y --auto-remove gcc \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy project files
COPY . /app

# Run DB init then app
CMD ["sh", "-c", "python init_db.py && python base.py"]
