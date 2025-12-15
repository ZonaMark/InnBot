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

    // Abrir/cerrar panel
    toggleBtn.addEventListener("click", () => {
      panel.classList.toggle("open");
      if (panel.classList.contains("open")) {
        speak("Hola, bienvenido, ¿en qué te puedo ayudar?");
      }
    });

    // Enviar pregunta
    sendBtn.addEventListener("click", () => {
      const q = questionEl.value.trim();
      if (!q) return;
      caption.textContent = "Recibí tu pregunta: " + q;
      speak("Recibí tu pregunta: " + q);
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
