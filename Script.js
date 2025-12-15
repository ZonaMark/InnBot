/* ============================================================
    CONFIGURACIÓN DEL SITIO Y ELEMENT SDK
============================================================ */
document.addEventListener("DOMContentLoaded", () => {

    initApp();
	cargarContactofooter();
	navigateToSection("Inicio"); //INICIO POR DEFECTO
	actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
});

function cargarContactofooter(){
	// Cargar datos desde cursos.json contacto
	fetch("Sections/cursos.json")
	.then(response => response.json())
	.then(data => {
		const contacto = data.contacto;
    // Insertar correo
		const footerEmailhref = `mailto:${contacto.correo}`;
		document.getElementById('footerEmailhref').setAttribute('href', footerEmailhref)
		document.getElementById('footerEmail').textContent = contacto.correo;
		// Insertar celular
		document.getElementById('footerPhone').textContent = contacto.celular;
		const telHref = `tel:${contacto.celular.replace(/\s+/g, '')}`;
        document.getElementById('footerPhoneLink').setAttribute('href', telHref);
    // Generar link de WhatsApp dinámico
		const whatsappLink = `https://wa.me/${contacto.celular.replace(/\D/g, '')}`;
		document.getElementById('footerWhatsApp').setAttribute('href', whatsappLink);
		document.getElementById('footerFacebook').setAttribute('href', contacto.facebook);
		document.getElementById('footerInstagram').setAttribute('href', contacto.instagram);
		document.getElementById('footerYoutube').setAttribute('href', contacto.youtube);
		document.getElementById('footerLinkedIn').setAttribute('href', contacto.linkedIn);
  })
	.catch(error => console.error('Error cargando datos de contacto:', error));
}


function cargarCursos() {
/* ================== CARGA DINÁMICA DE CURSOS==============*/
    const contenedorCursos = document.querySelector(".courses-grid");

    if (!contenedorCursos) {
        console.warn("⚠️ No se encontró .courses-grid aún, reintentando...");
        return;
    }

    // Cargar archivo JSON con los cursos
    fetch("Sections/cursos.json")
        .then(response => response.json())
        .then(data => {
            console.log("Cursos cargados correctamente:", data);
            generarCursos(data.cursos);
        })
    .catch(error => console.error("Error al cargar cursos.json:", error));

    /* ==============================================
       FUNCIÓN PARA GENERAR LAS TARJETAS DINÁMICAS
    ===============================================*/
  function generarCursos(listaCursos) {
    contenedorCursos.innerHTML = ""; // Limpia el contenedor

    listaCursos.forEach(curso => {
        const titulo = curso.titulo ?? "Sin título";
        const imagen = curso.imagen ?? "img/default.jpg";
        const duracion = curso.duracion ?? "Duración no especificada.";
        const modalidad = curso.modalidad ?? "Modalidad no definida.";
        const fechaTexto = curso.Fecha ?? "Sin fecha";

        let estadoFecha = "";
        let countdownId = null; // para guardar el intervalo

        const card = document.createElement("div");
        card.classList.add("course-card");

        // Crear contenedor para la fecha dinámica
        const fechaLi = document.createElement("li");
        fechaLi.textContent = "📅 " + fechaTexto;

        if (!fechaTexto.toLowerCase().includes("periodo")) {
            const [inicioStr, finStr] = fechaTexto.split(" al ");
            const inicio = new Date(inicioStr);
            const fin = new Date(finStr);
            const hoy = new Date();

            const diffDias = Math.floor((inicio - hoy) / (1000 * 60 * 60 * 24));

			if (diffDias >= 0 && diffDias <= 2) {
                // Crear cuenta regresiva en tiempo real
                function actualizarCuenta() {
                    const ahora = new Date();
                    const diff = inicio - ahora;

                    if (diff <= 0) {
                        clearInterval(countdownId);
                        fechaLi.textContent = "📚 Curso en Proceso";
                        return;
                    }

                    const horas = Math.floor(diff / (1000 * 60 * 60));
                    const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const segundos = Math.floor((diff % (1000 * 60)) / 1000);

                    fechaLi.textContent = `⏳ Inicia en ${horas}h ${minutos}m ${segundos}s`;
                }

                actualizarCuenta(); // primera ejecución inmediata
                countdownId = setInterval(actualizarCuenta, 1000);

            } else if (hoy >= inicio && hoy <= fin) {
                fechaLi.textContent = "📚 Curso en Proceso";
            } else if (hoy > fin) {
                fechaLi.textContent = "✅ Curso Terminado";
            }
            else {
				fechaLi.textContent = `⏳ Faltan ${diffDias} días para iniciar`;
			}
        }

        card.innerHTML = `
            <img src="${imagen}" alt="${titulo}">
            <h3>${titulo}</h3>
            <p class="course-info">${curso.frase}</p>
            <ul class="course-details">
                <li>${duracion}</li>
                <li>${curso.material}</li>
                <li>${curso.modalidad === "Presencial" ? "🏫" : "💻"} Modalidad: ${modalidad}</li>
            </ul>
            <button class="course-btn" onclick="inscribirme('${titulo}')"> Inscribirme </button>
        `;

        // Insertar la fecha dinámica en la lista
        card.querySelector(".course-details").appendChild(fechaLi);

        contenedorCursos.appendChild(card);
    });
}

}


function inscribirme(tituloCurso) {
    localStorage.setItem("cursoSeleccionado", tituloCurso);
    navigateToSection('Contacto');
}

async function cargarCursosEnSelect() {
    const select = document.getElementById("curso");

    if (!select) return;

    try {
        const response = await fetch("Sections/cursos.json");
        const data = await response.json();
		const contacto = data.contacto;
        data.cursos.forEach(curso => {
            const option = document.createElement("option");
            option.value = curso.titulo;
            option.textContent = curso.titulo;
            select.appendChild(option);
        });
        const cursoGuardado = localStorage.getItem("cursoSeleccionado");
        if (cursoGuardado) {
            select.value = cursoGuardado;
        }

    // Generar link de WhatsApp dinámico
		const whatsappLink = `https://wa.me/${contacto.celular.replace(/\D/g, '')}`;
		document.getElementById('Contac-WhatsApp').setAttribute('href', whatsappLink);
    // Insertar correo
		const contactEmailhref = `mailto:${contacto.correo}`;
		document.getElementById('contactEmail').textContent = contacto.correo;
		document.getElementById('contactEmailhref').setAttribute('href', contactEmailhref)
   // Insertar facebook
		document.getElementById('contactFacebook').setAttribute('href', contacto.facebook);
   // Insertar Instagram
		document.getElementById('contactInstagram').setAttribute('href', contacto.instagram);
   // Insertar youtube
		document.getElementById('contactYoutube').setAttribute('href', contacto.youtube);
    } catch (error) {
        console.error("Error al cargar cursos en select:", error);
    }
}

function initApp() {
	const defaultConfig = {
		background_color: "#0a0e27",
		surface_color: "#1a1f3a",
		text_color: "#ffffff",
		primary_action_color: "#00d9ff",
		secondary_action_color: "#7c3aed"
	};
	let config = { ...defaultConfig };

	function onConfigChange(newConfig) {
		config = { ...config, ...newConfig };
		applyConfig();
	}

	function applyConfig() {
		document.documentElement.style.setProperty("--background", config.background_color);
		document.documentElement.style.setProperty("--surface", config.surface_color);
		document.documentElement.style.setProperty("--text-color", config.text_color);
		document.documentElement.style.setProperty("--accent-primary", config.primary_action_color);
		document.documentElement.style.setProperty("--accent-secondary", config.secondary_action_color);
	}

	applyConfig();
}


async function navigateToSection(sectionName) {
    const mainSection = document.getElementById("heroSection");

    if (!mainSection) {
		console.error("No se encontró #heroSection en index.html");
        return;
    }
    try {
        const response = await fetch(`Sections/${sectionName}.html`);

        if (!response.ok) {
            mainSection.innerHTML = `<p style="color:red;">No se pudo cargar la sección "${sectionName}".</p>`;
            return;
        }
        const html = await response.text();

        // Extraemos el contenido del <main> del archivo externo
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const sectionContent = doc.querySelector("main"); // buscamos solo el main interior
        if (sectionContent) {
            mainSection.innerHTML = sectionContent.innerHTML;

        } else {
            mainSection.innerHTML = `<p style="color:red;">La sección "${sectionName}" no tiene un &lt;main&gt; válido.</p>`;
        }

    } catch (error) {
        mainSection.innerHTML = `<p style="color:red;">Error: No se encuentra la seccion: "${sectionName}".</p>`;
        console.error(error);
    }
    if (sectionName === "Cursos") {
        setTimeout(() => cargarCursos(), 50);
    }
    if (sectionName === "Contacto") {
        setTimeout(() => cargarCursosEnSelect(), 50);
    }

    setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, 300);
}

/* ============================================================
    ZOOM DEL SITIO
============================================================ */

let zoomLevel = 90;
const zoomDisplay = document.getElementById("zoomLevel");

document.getElementById("zoomIn").addEventListener("click", () => {
    zoomLevel += 10;
    document.body.style.zoom = zoomLevel + "%";
    zoomDisplay.textContent = zoomLevel + "%";
});

document.getElementById("zoomOut").addEventListener("click", () => {
    zoomLevel = Math.max(50, zoomLevel - 10);
    document.body.style.zoom = zoomLevel + "%";
    zoomDisplay.textContent = zoomLevel + "%";
});

/* ============================================================
    TEMA OSCURO / CLARO
============================================================ */

let isDarkMode = true;
 // Tema oscuro/claro
        document.getElementById('themeToggle').addEventListener('click', () => {
            isDarkMode = !isDarkMode;
            document.body.classList.toggle('light-mode');
            document.getElementById('themeToggle').textContent = isDarkMode ? '🌙' : '☀️';
        });

function actualizarFechaHora() {
  const ahora = new Date();

  const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const fechaFormateada = ahora.toLocaleDateString('es-MX', opcionesFecha);

  // Hora con segundos (formato 24h)
  const horaFormateada = ahora.toLocaleTimeString('es-MX', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  });

  const elFecha = document.getElementById('fecha');
  const elHora = document.getElementById('hora');

  if (elFecha) elFecha.textContent = fechaFormateada;
  if (elHora)  elHora.textContent  = horaFormateada;
}

/* ============================
     CARGAR CONTENIDO EXTERNO
============================ */

let whoData = {}; // Aquí se almacenarán todos los textos

fetch("Sections/Who-content.html")
  .then(res => res.text())
  .then(html => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    const items = tempDiv.querySelectorAll(".who-info");

    items.forEach(item => {
      const id = item.id;  // item-0, item-1...

      // Tomamos el título
      const title = item.querySelector("h2").textContent;

      // Capturar todo el contenido del item EXCEPTO el h2
      const fullHTML = item.innerHTML;
      const contentOnly = fullHTML.replace(item.querySelector("h2").outerHTML, "").trim();

      whoData[id] = {
        title: title,
        text: contentOnly
      };
    });
  });

/* ============================
      MODAL DINÁMICO
============================ */
const whoCards = document.querySelectorAll(".who-card");
const modal = document.getElementById("whoModal");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const modalClose = document.querySelector(".who-modal-close");

whoCards.forEach(card => {
  card.addEventListener("click", () => {
    const index = card.dataset.index;  // 0,1,2,3
    const key = `item-${index}`;

    if (whoData[key]) {
      modalTitle.textContent = whoData[key].title;
      modalText.innerHTML = whoData[key].text;
      modal.classList.add("active");
    }
  });
});

// Cerrar modal
modalClose.addEventListener("click", () => modal.classList.remove("active"));
window.addEventListener("click", e => {
  if (e.target === modal) modal.classList.remove("active");
});
/* =============== sidebar=====================*/

const sidebar = document.getElementById("sidebar");
const mainContent = document.getElementById("mainContent");
const menuToggle = document.getElementById("menuToggle");
const overlay = document.getElementById("overlay");

// Toggle con botón

menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle('open');
  overlay.classList.toggle('open');

  if (window.innerWidth > 768) {
    mainContent.classList.toggle("shifted");
  }
});

// Cerrar al hacer click en overlay (móvil)
overlay.addEventListener("click", () => {
  sidebar.classList.remove("open");
  overlay.classList.remove("open");
  mainContent.classList.remove("shifted");
});

// Gestos táctiles (móvil)
let startX = 0;
let currentX = 0;
let gestureEnabled = false;

document.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
  // Solo activar si empieza cerca del borde izquierdo (20px)
  gestureEnabled = startX < 20;
});

document.addEventListener("touchmove", (e) => {
    if (!gestureEnabled) return;
  currentX = e.touches[0].clientX;
});

document.addEventListener("touchend", () => {
  if (!gestureEnabled) return;

  let diffX = currentX - startX;

  // Deslizar hacia la derecha → abrir
  if (diffX > 50) {
    sidebar.classList.add("open");
    overlay.classList.add("open");
  }

  // Deslizar hacia la izquierda → cerrar
  if (diffX < -50) {
    sidebar.classList.remove("open");
    overlay.classList.remove("open");
    mainContent.classList.remove("shifted");
  }
});





