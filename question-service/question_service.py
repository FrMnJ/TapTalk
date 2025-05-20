from fastapi import FastAPI
import random
import uvicorn

app = FastAPI()

questions = [
    "¿Cuál es tu película favorita de todos los tiempos?",
    "Si pudieras cenar con cualquier persona del mundo, ¿quién sería?",
    "¿Prefieres la playa o la montaña?",
    "¿Cuál ha sido el mejor concierto al que has ido?",
    "¿Qué harías si te ganaras la lotería mañana?",
    "¿Tienes algún talento oculto?",
    "¿Qué serie podrías ver una y otra vez sin aburrirte?",
    "¿Qué es algo que siempre quisiste aprender y nunca lo hiciste?",
    "¿Cuál ha sido el viaje más memorable que has hecho?",
    "¿Qué canción pondrías si fueras DJ en una fiesta?"
]

@app.get("/get-random-question")
def get_question():
    return {"question": random.choice(questions)}

# Para ejecutar con: python question_service.py
if __name__ == "__main__":
    uvicorn.run("question_service:app", host="0.0.0.0", port=8080)
