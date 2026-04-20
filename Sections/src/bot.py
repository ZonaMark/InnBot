import json
import os

# Cargar sinónimos
with open(os.path.join(os.path.dirname(__file__), '../data/synonyms.json'), encoding='utf-8') as f:
    SYNONYMS = json.load(f)

def detectar_intencion(texto):
    texto = texto.lower()
    for intent, palabras in SYNONYMS.items():
        if any(palabra in texto for palabra in palabras):
            return intent
    return "desconocido"

def responder(intencion):
    if intencion == "robotica":
        return ("¡Me encanta que estés interesado en nuestros cursos! "
                "Tenemos varios niveles:\n"
                "- Básico: orientado a principiantes.\n"
                "- Intermedio: para quienes ya tienen nociones.\n"
                "- Avanzado: con proyectos complejos.\n"
                "- Experto: para investigación y aplicaciones profesionales.")
    elif intencion == "saludo":
        return "¡Hola! ¿En qué puedo ayudarte hoy?"
    else:
        return "Lo siento, no entendí tu mensaje. ¿Podrías reformularlo?"
