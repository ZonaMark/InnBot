const homepath = "https://zonamark/ZM/";
function cargar(){
  const dias = [
    { numero: 1, titulo: "Matemáticas y lógica", desc: "TuxMath, Math Playground. Torneo y retos por nivel." },
    { numero: 2, titulo: "Geografía y exploración", desc: "Seterra, Google Earth. Viaje virtual por equipos." },
    { numero: 3, titulo: "Lenguaje y uso de monedas", desc: "Khan Academy Kids y ABCya Money Games." },
    { numero: 4, titulo: "Inglés con juegos", desc: "British Council – LearnEnglish Kids." },
    { numero: 5, titulo: "Evaluación, IA y presentación", desc: "TuxMath, AI for Oceans, Lightbot y constancia." }
  ];

  const main = document.getElementById("main-container");

  // Sección timeline
  const timeline = document.createElement("section");
  timeline.className = "timeline";

  dias.forEach(dia => {
    const card = document.createElement("div");
    card.className = "day-card";
    card.dataset.day = dia.numero;

    card.innerHTML = `
      <div class="day-header">
        <h2>Día ${dia.numero} — ${dia.titulo}</h2>
        <span class="status badge">Bloqueado</span>
      </div>
      <p class="day-desc">${dia.desc}</p>
      <button class="open-btn" disabled>Abrir</button>
    `;
    timeline.appendChild(card);
  });

  // Sección panel
  const panel = document.createElement("section");
  panel.className = "day-panel";
  panel.innerHTML = `
    <div class="panel-header">
      <h3 id="panel-title">Selecciona un día</h3>
      <div class="panel-actions">
        <button id="start-day-btn" class="primary" disabled>Iniciar día</button>
        <button id="finish-day-btn" class="success" disabled>¡Todos terminamos!</button>
      </div>
    </div>
    <div id="activities-list" class="activities-list"></div>
    <div class="closing-game">
      <h4>Juego de cierre (máx. 25 min)</h4>
      <div class="closing-controls">
        <button id="start-closing-btn" class="secondary" disabled>Iniciar juego de cierre</button>
        <a id="closing-link" href="#" target="_blank" rel="noopener" class="closing-link">Abrir juego</a>
      </div>
      <p id="closing-desc" class="closing-desc"></p>
    </div>
  `;

  // Insertar en el main
  main.appendChild(timeline);
  main.appendChild(panel);
}

async function cargarModulo() {
  const modulo = await import("./script.js");
}

function validarLlave() {
    const data = localStorage.getItem("llaveAcceso");
    if (!data) {
		document.body.innerHTML = "Acceso no autorizado";
		setTimeout(() => {
			window.location.href = homepath;
		}, 3000);
      return;
    }
    const { llave, expiracion } = JSON.parse(data);

    // Validar expiración
    if (Date.now() > expiracion) {
      document.body.innerHTML = "Llave expirada";
		setTimeout(() => {
			window.location.href = homepath;
		}, 3000);
	  return;
    }
    localStorage.setItem("llaveAcceso", "");
    // validar contra Firebase pendiente
	cargar();
	cargarModulo();
}

validarLlave();
