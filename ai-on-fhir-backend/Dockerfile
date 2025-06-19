# Flask backend Dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY . /app

RUN pip install --no-cache-dir flask flask-cors spacy
RUN python -m spacy download en_core_web_sm

EXPOSE 5000
CMD ["python", "app.py"]
