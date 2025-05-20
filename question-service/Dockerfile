FROM python:3.11-slim

WORKDIR /app

COPY question_service.py .

RUN pip install --no-cache-dir fastapi uvicorn

CMD ["python", "question_service.py"]
