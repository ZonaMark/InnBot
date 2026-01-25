// Cargar chatbot.html dentro de #chatbot-container
fetch("Sections/chatbot.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("chatbot-container").innerHTML = html;

    // Inicializar lógica del chatbot
    const toggleBtn = document.getElementById("chatbotToggle");
    const panel = document.getElementById("chatbotPanel");
    const caption = document.getElementById("chatbotCaption");
    const questionEl = document.getElementById("chatbotQuestion");
    const sendBtn = document.getElementById("chatbotSend");

    // Lista de fuentes JSON que el chatbot puede usar
    const dataSources = [
      { name: "cursos", path: "Sections/cursos.json" },
      { name: "ventas", path: "Sections/ventas.json" }
      // Aquí puedes seguir agregando más { name, path }
    ];
    // Función para cargar todas las fuentes
    async function loadDataSources() {
      const results = {};
      for (const src of dataSources) {
        try {
          const data = await fetch(src.path).then(res => res.json());
          results[src.name] = data;
		  console.log(data);
        } catch (err) {
          console.error("Error cargando", src.name, err);
        }
      }
      return results;
    }

    // --- Mapa de palabras clave → función de respuesta ---
    const handlers = {
      curso: (data) => {
        if (data.cursos?.cursos) {
          return "Estos son nuestros cursos:\n" +
            data.cursos.cursos.map(c => `- ${c.titulo}: ${c.frase} (${c.modalidad}, ${c.duracion})`).join("\n");
        }
        return "No encontré cursos.";
      },
      teléfono: (data) => data.cursos?.contacto?.celular ? "Nuestro número es: " + data.cursos.contacto.celular : "No encontré teléfono.",
      celular: (data) => data.cursos?.contacto?.celular ? "Nuestro número es: " + data.cursos.contacto.celular : "No encontré celular.",
      correo: (data) => data.cursos?.contacto?.correo ? "Puedes escribirnos a: " + data.cursos.contacto.correo : "No encontré correo.",
      email: (data) => data.cursos?.contacto?.correo ? "Puedes escribirnos a: " + data.cursos.contacto.correo : "No encontré email.",
      facebook: (data) => "Nuestro Facebook: " + (data.cursos?.contacto?.facebook || "No disponible"),
      instagram: (data) => "Nuestro Instagram: " + (data.cursos?.contacto?.instagram || "No disponible"),
      youtube: (data) => "Nuestro canal de YouTube: " + (data.cursos?.contacto?.youtube || "No disponible"),
      linkedin: (data) => "Nuestro LinkedIn: " + (data.cursos?.contacto?.linkedIn || "No disponible"),
      venta: (data) => {
        if (data.ventas) {
          return "Productos disponibles:\n" +
            data.ventas.map(v => `- ${v.Descripción} | Precio: ${v["Con Iva"]} MXN | Stock: ${v.Existencias}`).join("\n");
        }
        return "No encontré ventas.";
      },
      producto: (data) => {
        if (data.ventas) {
          return "Productos disponibles:\n" +
            data.ventas.map(v => `- ${v.Descripción} | Precio: ${v["Con Iva"]} MXN | Stock: ${v.Existencias}`).join("\n");
        }
        return "No encontré productos.";
      },
      precio: (data) => {
        if (data.ventas) {
          return "Precios de productos:\n" +
            data.ventas.map(v => `- ${v.Descripción}: ${v["Con Iva"]} MXN`).join("\n");
        }
        return "No encontré precios.";
      }
    };

    // Abrir/cerrar panel
    toggleBtn.addEventListener("click", () => {
      panel.classList.toggle("open");
      if (panel.classList.contains("open")) {
        speak("Hola, bienvenido, ¿en qué te puedo ayudar? en desarrollo");
      }
    });

    // Enviar pregunta
    sendBtn.addEventListener("click", async () => {
      const q = questionEl.value.trim().toLowerCase();
      if (!q) return;

      const data = await loadDataSources();
      let respuesta = "No encontré información sobre eso.";

      // Buscar palabra clave en el mapa
      for (const keyword in handlers) {
        if (q.includes(keyword)) {
          respuesta = handlers[keyword](data);
          break;
        }
      }

      caption.textContent = respuesta;
      speak(respuesta);
      questionEl.value = "";
    });

    // Voz TTS
    function speak(text) {
      if (!("speechSynthesis" in window)) return;
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "es-MX";
      window.speechSynthesis.speak(utter);
    }
  })
  .catch(err => console.error("Error cargando chatbot:", err));
