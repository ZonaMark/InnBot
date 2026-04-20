from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from bot import detectar_intencion, responder

app = Flask(__name__)
CORS(app)  # <-- habilita CORS para todas las rutas

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    mensaje = request.json.get("mensaje", "")
    intencion = detectar_intencion(mensaje)
    respuesta = responder(intencion)
    return jsonify({"respuesta": respuesta})

if __name__ == "__main__":
    app.run(debug=True)
