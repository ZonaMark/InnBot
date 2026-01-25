// Datos del curso: actividades por día con tiempos y URLs
// Sonidos
const soundSlime = new Audio("sounds/slime.mp3");
const soundCongrats = new Audio("sounds/congrats.mp3");
const soundTimer = new Audio("sounds/timer.mp3");
soundSlime.volume = 0.7;     // 70%
soundCongrats.volume = 0.9;  // 90%
soundTimer.volume = 0.5;     // 50%



const courseData = {
  1: {
    title: "Día 1 — Matemáticas y lógica",
    activities: [
      {
        title: "Presentación del curso + niveles",
        durationMin: 25,
        description: "Modelo pedagógico y reglas. Niveles: 🟢 Básico (5–6), 🔵 Intermedio (7–9), 🟣 Avanzado (10–12).",
        links: []
      },
      {
        title: "TuxMath — operaciones por nivel",
        durationMin: 25,
        description: "🟢 Sumas/restas, 🔵 multiplicaciones, 🟣 mixtas.",
        links: [{label: "TuxMath", href: "https://tuxmath.org"}]
      },
      {
        title: "Receso",
        durationMin: 15,
        description: "Descanso activo (agua, estiramientos, respiro visual).",
        links: []
      },
      {
        title: "Math Playground — aritmética y lógica",
        durationMin: 30,
        description: "Retos gamificados de operaciones y pensamiento lógico.",
        links: [{label: "Jugando con la mente", href: "https://pbskids.org/games/spanish"}]
      },
      {
        title: "Mini torneo — estaciones por tiempos",
        durationMin: 30,
        description: "Puntuación por precisión y tiempo en TuxMath.",
        links: [{label: "TuxMath", href: "https://tuxmath.org"}]
      }
    ],
    closingGame: {
      title: "PBS Kids – Curious George Balloon Pop",
      durationMin: 25,
      desc: "Matemáticas con personaje favorito. Premia a quienes terminaron; motiva a los demás.",
      link: "https://pbskids.org/games/play/flower-garden/2584737/es"
    },
    backup: [
      {label: "Tux Paint (respaldo offline)", href: "https://tuxpaint.org"}
    ]
  },
  2: {
    title: "Día 2 — Geografía y exploración",
    activities: [
      {
        title: "Seterra — continentes/países/capitales",
        durationMin: 25,
        description: "🟢 Continentes, 🔵 países, 🟣 capitales.",
        links: [{label: "Seterra", href: "https://www.seterra.com"}]
      },
      {
        title: "Google Earth — exploración guiada",
        durationMin: 25,
        description: "Lugares emblemáticos y marcadores.",
        links: [{label: "Google Earth Web", href: "https://earth.google.com/web"}]
      },
      {
        title: "Receso",
        durationMin: 15,
        description: "Descanso activo.",
        links: []
      },
      {
        title: "Seterra — retos de localización",
        durationMin: 30,
        description: "Ranking por aciertos y tiempo.",
        links: [{label: "Seterra", href: "https://www.geoguessr.com/es/vgp/3004"}]
      },
      {
        title: "Google Earth — mini viaje virtual",
        durationMin: 30,
        description: "Recorrido con capturas y notas.",
        links: [{label: "Google Earth Web", href: "https://earth.google.com/web"}]
      }
    ],
    closingGame: {
      title: "Seterra con guía animada (Pocoyó)",
      durationMin: 25,
      desc: "Dinámica lúdica con pistas visuales.",
      link: "https://www.seterra.com"
    },
    backup: [{label: "Tux Paint (mapa del viaje)", href: "https://tuxpaint.org"}]
  },
  3: {
    title: "Día 3 — Lenguaje y uso de monedas",
    activities: [
      {
        title: "Khan Academy Kids — lectura guiada",
        durationMin: 25,
        description: "Cuentos y comprensión por nivel.",
        links: [{label: "Khan Academy Kids", href: "https://learn.khanacademy.org/khan-academy-kids"}]
      },
      {
        title: "Escritura breve y preguntas",
        durationMin: 25,
        description: "Resumen y preguntas comprensivas.",
        links: [{label: "Khan Academy Kids", href: "https://learn.khanacademy.org/khan-academy-kids"}]
      },
      {
        title: "Receso",
        durationMin: 15,
        description: "Descanso activo.",
        links: []
      },
      {
        title: "ABCya — Money Games",
        durationMin: 30,
        description: "Comprar, sumar precios y dar cambio.",
        links: [{label: "ABCya Money Games", href: "https://www.mathsisfun.com/money/money-master.html"}]
      },
      {
        title: "Mini cuento ilustrado + mercado",
        durationMin: 30,
        description: "Vocabulario y precios del mercado (integración).",
        links: [
          {label: "Khan Academy Kids", href: "https://learn.khanacademy.org/khan-academy-kids"},
          {label: "ABCya Money Games", href: "https://www.abcya.com"}
        ]
      }
    ],
    closingGame: {
      title: "Khan Academy Kids — Story Time",
      durationMin: 25,
      desc: "Cuento interactivo con personajes animales.",
      link: "https://learn.khanacademy.org/khan-academy-kids"
    },
    backup: [{label: "Tux Paint (ilustrar cuento)", href: "https://tuxpaint.org"}]
  },
  4: {
    title: "Día 4 — Inglés con juegos",
    activities: [
      {
        title: "Canciones y vocabulario",
        durationMin: 25,
        description: "Vocabulario básico por nivel.",
        links: [{label: "British Council – LearnEnglish Kids", href: "https://learnenglishkids.britishcouncil.org"}]
      },
      {
        title: "Palabras y frases",
        durationMin: 25,
        description: "Spelling, matching, ordering.",
        links: [{label: "British Council – LearnEnglish Kids", href: "https://learnenglishkids.britishcouncil.org"}]
      },
      {
        title: "Receso",
        durationMin: 15,
        description: "Descanso activo.",
        links: []
      },
      {
        title: "Comprensión auditiva y pronunciación",
        durationMin: 30,
        description: "Listening + práctica guiada.",
        links: [{label: "British Council – LearnEnglish Kids", href: "https://learnenglishkids.britishcouncil.org"}]
      },
      {
        title: "Diálogo corto por equipos",
        durationMin: 30,
        description: "Guion por nivel y presentación.",
        links: [{label: "British Council – LearnEnglish Kids", href: "https://learnenglishkids.britishcouncil.org"}]
      }
    ],
    closingGame: {
      title: "British Council — Word Games (superhéroes)",
      durationMin: 25,
      desc: "Mini-juegos de palabras con estética de héroes.",
      link: "https://learnenglishkids.britishcouncil.org"
    },
    backup: [{label: "Lightbot (lógica breve)", href: "https://lightbot.com"}]
  },
  5: {
    title: "Día 5 — Evaluación, IA y presentación",
    activities: [
      {
        title: "Torneo TuxMath por niveles",
        durationMin: 25,
        description: "Competencia de precisión y tiempo.",
        links: [{label: "TuxMath", href: "https://tuxmath.org"}]
      },
      {
        title: "Code.org — AI for Oceans",
        durationMin: 25,
        description: "Datos, entrenamiento, sesgos.",
        links: [{label: "AI for Oceans", href: "https://studio.code.org/s/oceans"}]
      },
      {
        title: "Receso",
        durationMin: 15,
        description: "Descanso activo.",
        links: []
      },
      {
        title: "Lightbot — lógica visual",
        durationMin: 30,
        description: "Secuencias e iteraciones.",
        links: [{label: "Lightbot", href: "https://lightbot.com"}]
      },
      {
        title: "Presentaciones por equipos",
        durationMin: 30,
        description: "Síntesis de aprendizajes.",
        links: []
      }
    ],
    closingGame: {
      title: "TuxMath + Lightbot Bonus",
      durationMin: 25,
      desc: "Doble personaje: Tux pingüino y robot.",
      link: "https://tuxmath.org"
    },
    backup: [{label: "Code.org — Cursos A–D", href: "https://studio.code.org"}]
  }
};

// Estado inicial: Día 1 desbloqueado
let unlockedDay = 1;
let selectedDay = null;
let countdownInterval = null;
let remainingSeconds = 0;

// Elementos DOM
const timelineCards = document.querySelectorAll(".day-card");
const panelTitle = document.getElementById("panel-title");
const activitiesList = document.getElementById("activities-list");
const startDayBtn = document.getElementById("start-day-btn");
const finishDayBtn = document.getElementById("finish-day-btn");
const startClosingBtn = document.getElementById("start-closing-btn");
const closingLink = document.getElementById("closing-link");
const closingDesc = document.getElementById("closing-desc");

// Slime overlay
const slimeOverlay = document.getElementById("slime-overlay");
const slimeFill = document.querySelector(".slime-fill");
const closeSlimeBtn = document.getElementById("close-slime-btn");
const countdownMin = document.getElementById("countdown-min");
const countdownSec = document.getElementById("countdown-sec");

// Felicitación y constancia
const congratsOverlay = document.getElementById("congrats-overlay");
const closeCongratsBtn = document.getElementById("close-congrats-btn");
const certificateOverlay = document.getElementById("certificate-overlay");
const closeCertBtn = document.getElementById("close-cert-btn");

// Inicialización de la línea de tiempo
function initTimeline() {
  timelineCards.forEach(card => {
    const day = Number(card.dataset.day);
    const btn = card.querySelector(".open-btn");
    const badge = card.querySelector(".badge");

    if (day === 1) {
      card.classList.add("unlocked");
      badge.textContent = "Desbloqueado";
      btn.disabled = false;
    } else {
      card.classList.add("locked");
      badge.textContent = "Bloqueado";
      btn.disabled = true;
    }

    btn.addEventListener("click", () => openDay(day));
  });
}

function openDay(day) {
  selectedDay = day;
  const data = courseData[day];
  panelTitle.textContent = data.title;
  renderActivities(day);

  // Configurar juego de cierre
  closingLink.href = data.closingGame.link;
  closingLink.textContent = "Abrir juego";
  closingDesc.textContent = `${data.closingGame.title} — ${data.closingGame.desc} (máx. ${data.closingGame.durationMin} min)`;

  // Habilitar controles del panel
  startDayBtn.disabled = false;
  finishDayBtn.disabled = false;
  startClosingBtn.disabled = false;
}

function renderActivities(day) {
  const data = courseData[day];
  activitiesList.innerHTML = "";

  data.activities.forEach((act, index) => {
    const card = document.createElement("div");
    card.className = "activity-card";

    const left = document.createElement("div");
    const right = document.createElement("div");
    right.className = "activity-actions";

    const title = document.createElement("h4");
    title.className = "activity-title";
    title.textContent = act.title;

    const meta = document.createElement("p");
    meta.className = "activity-meta";
    meta.textContent = `${act.description}`;

    const links = document.createElement("div");
    links.className = "activity-links";
    act.links.forEach(l => {
      const a = document.createElement("a");
      a.href = l.href;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = l.label;
      links.appendChild(a);
    });

    const timerBadge = document.createElement("span");
    timerBadge.className = "timer-badge";
    timerBadge.textContent = `${act.durationMin} min`;

    const startBtn = document.createElement("button");
    startBtn.className = "secondary";
    startBtn.textContent = "Iniciar temporizador";
    startBtn.addEventListener("click", () => startActivityTimer(act.durationMin));

    left.appendChild(title);
    left.appendChild(meta);
    if (act.links.length) left.appendChild(links);

    right.appendChild(timerBadge);
    right.appendChild(startBtn);

    card.appendChild(left);
    card.appendChild(right);
    activitiesList.appendChild(card);
  });
}

// Temporizador visual con “bomba de moco”
function startActivityTimer(minutes) {
  remainingSeconds = minutes * 60;
  slimeOverlay.classList.remove("hidden");
  gsap.set(slimeFill, {height: "0%"});
  updateCountdown();
  // Sonido de inicio
  soundTimer.play();
  gsap.to(slimeFill, {
    height: "100%",
    duration: remainingSeconds,
    ease: "none"
  });

  countdownInterval = setInterval(() => {
    remainingSeconds--;
    updateCountdown();
    if (remainingSeconds <= 0) {
      clearInterval(countdownInterval);
	  // Sonido de explosión slime
      soundSlime.play();
	  // Animación de “explosión” simpática
      gsap.to(slimeFill, {height: "100%", duration: 0.2});
      gsap.to(slimeOverlay, {backgroundColor: "rgba(10,10,10,0.9)", duration: 0.3});
      // Pequeño rebote
      gsap.fromTo(slimeFill, {scaleY: 1}, {scaleY: 1.05, yoyo: true, repeat: 3, duration: 0.1});
    }
  }, 1000);
}

function updateCountdown() {
  const m = Math.max(0, Math.floor(remainingSeconds / 60));
  const s = Math.max(0, remainingSeconds % 60);
  countdownMin.textContent = String(m).padStart(2, "0");
  countdownSec.textContent = String(s).padStart(2, "0");
}

closeSlimeBtn.addEventListener("click", () => {
  slimeOverlay.classList.add("hidden");
  gsap.killTweensOf(slimeFill);
  if (countdownInterval) clearInterval(countdownInterval);
});

// Iniciar el día (opcional: animación de entrada en panel)
startDayBtn.addEventListener("click", () => {
  if (!selectedDay) return;
  gsap.from(".activity-card", {opacity: 0, y: 10, stagger: 0.05, duration: 0.3});
});

// Juego de cierre
startClosingBtn.addEventListener("click", () => {
  if (!selectedDay) return;
  const closingMin = courseData[selectedDay].closingGame.durationMin;
  startActivityTimer(closingMin);
});

// Finalizar día y desbloquear el siguiente
finishDayBtn.addEventListener("click", () => {
  if (!selectedDay) return;
  showCongrats(selectedDay);
});

function showCongrats(day) {
  congratsOverlay.classList.remove("hidden");
  gsap.fromTo(".congrats-card", {scale: 0.9, opacity: 0}, {scale: 1, opacity: 1, duration: 0.25});
  // Sonido de felicitación
  soundCongrats.play()
}

closeCongratsBtn.addEventListener("click", () => {
  congratsOverlay.classList.add("hidden");
  markDayCompleted(selectedDay);
  unlockNextDay(selectedDay);
});

function markDayCompleted(day) {
  const card = document.querySelector(`.day-card[data-day="${day}"]`);
  const badge = card.querySelector(".badge");
  card.classList.remove("unlocked", "locked");
  card.classList.add("completed");
  badge.textContent = "Completado ✔";
  const openBtn = card.querySelector(".open-btn");
  openBtn.disabled = false;
}

function unlockNextDay(day) {
  const next = day + 1;
  const nextCard = document.querySelector(`.day-card[data-day="${next}"]`);
  if (!nextCard) {
    // Si es el último día, mostrar constancia
    showCertificate();
    return;
  }
  const badge = nextCard.querySelector(".badge");
  nextCard.classList.remove("locked");
  nextCard.classList.add("unlocked");
  badge.textContent = "Desbloqueado";
  const btn = nextCard.querySelector(".open-btn");
  btn.disabled = false;
}

function showCertificate() {
  certificateOverlay.classList.remove("hidden");
  gsap.fromTo(".certificate-card", {y: 20, opacity: 0}, {y: 0, opacity: 1, duration: 0.3});
}

closeCertBtn.addEventListener("click", () => {
  certificateOverlay.classList.add("hidden");
});

window.onload = initTimeline();;
window.onload = openDay(1);
