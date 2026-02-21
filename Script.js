/* ============================================================
    CONFIGURACIÓN DEL SITIO Y ELEMENT SDK
============================================================ */
import { validarCodigo } from "./Sections/ScriptForm.js";
let isDarkMode = true;

export function iniciarSitio() {
  initApp();
  cargarInicio();
  cargarContactofooter();
  navigateToSection("Inicio");
  initSidebar();
  actualizarFechaHora();
  setInterval(actualizarFechaHora, 1000);
  document.getElementById("overlaySecun").addEventListener("click", ocultarModal);
}

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
    localStorage.setItem("whatsapp", contacto.celular.replace(/\D/g, ''));
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
            generarCursos(data.cursos, data.contacto);
        })
    .catch(error => console.error("Error al cargar cursos.json:", error));
    /* ==============================================
       FUNCIÓN PARA GENERAR LAS TARJETAS DINÁMICAS
    ===============================================*/
  function generarCursos(listaCursos, contacto) {
    contenedorCursos.innerHTML = ""; // Limpia el contenedor
	const celular = contacto.celular.replace(/\D/g, "");

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

		const enlaceWhatsApp = `https://wa.me/${celular}?text=Info%20del%20curso%20:%20${encodeURIComponent(titulo)}`;

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
                        fechaLi.textContent = "📚 Estatus: Curso en Proceso";
                        return;
                    }

                    const horas = Math.floor(diff / (1000 * 60 * 60));
                    const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const segundos = Math.floor((diff % (1000 * 60)) / 1000);
                    fechaLi.classList.add("box-elegante");
                    fechaLi.textContent = `⏳ Estatus: Inicia en ${horas}h ${minutos}m ${segundos}s`;
                }

                actualizarCuenta(); // primera ejecución inmediata
                countdownId = setInterval(actualizarCuenta, 1000);

            } else if (hoy >= inicio && hoy <= fin) {
                fechaLi.classList.add("box-elegante");
                fechaLi.textContent = "📚 Estatus: Curso en Proceso";
            } else if (hoy > fin) {
                fechaLi.textContent = "✅ Estatus: Curso Terminado";
            }
            else {
                const opciones = { weekday: "long", day: "numeric", month: "long" };
                const fechaIni = inicio.toLocaleDateString("es-MX", opciones);
                const fechaFin = fin.toLocaleDateString("es-MX", opciones);
                fechaLi.classList.add("box-elegante");
                fechaLi.textContent = `⏳ Estatus: ${fechaIni} al ${fechaFin} Faltan ${diffDias} días para iniciar`;
			}
        }

        card.innerHTML = `
            <div class="card-img">
				<img src="${imagen}" alt="${titulo}" class="img-card">
            </div>
            <h3>${titulo}</h3>
            <p class="course-info">${curso.frase}</p>
            <ul class="course-details">
                <li>${duracion}</li>
                <li>${curso.material}</li>
                <li>${curso.modalidad === "Presencial" ? "🏫" : "💻"} Modalidad: ${modalidad}</li>
            </ul>
            <div class="qr-container">
				<img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(enlaceWhatsApp)}&size=300x300&ecc=Q&format=svg&margin=4" alt="QR WhatsApp" title="Hazme más grande" class="qr" data-curso='${titulo}'>
				<button class="course-btn" id="btnInscribirme" data-titulo="${titulo}"> Inscribirme </button>
			</div>
        `;
        // Insertar la fecha dinámica en la lista
        card.querySelector(".course-details").appendChild(fechaLi);
        contenedorCursos.appendChild(card);
    });
	}
}



function cargarProyectos() {
/* ================== CARGA DINÁMICA DE CURSOS==============*/
    const contenedorProyec = document.querySelector(".courses-grid");

    if (!contenedorProyec) {
        console.warn("⚠️ No se encontró .courses-grid aún, reintentando...");
        return;
    }

    // Cargar archivo JSON con los cursos
    fetch("Sections/proyectos.json")
        .then(response => response.json())
        .then(data => {
            generarProyectos(data.proyectos);
        })
    .catch(error => console.error("Error al cargar proyectos.json:", error));
    /* ==============================================
       FUNCIÓN PARA GENERAR LAS TARJETAS DINÁMICAS
    ===============================================*/
  function generarProyectos(listaProyectos) {
    contenedorProyec.innerHTML = ""; // Limpia el contenedor
    listaProyectos.forEach(proyecto => {
        const titulo = proyecto.titulo ?? "Error al Cargar proyecto";
        const imagen = proyecto.imagen ?? "img/default.jpg";
        const frase = proyecto.frase ?? "No localizado.";
        const material = proyecto.material ?? "No localizado";
        const card = document.createElement("div");
        card.classList.add("course-card");

        card.innerHTML = `
            <div class="card-img">
				<img src="${imagen}" alt="${titulo}" class="img-card">
            </div>
            <h3>${titulo}</h3>
            <p class="course-info">${frase}</p>
            <ul class="course-details">
                <li>${material}</li>
            </ul>
        `;
        contenedorProyec.appendChild(card);
    });
	}
}


function cargarServicios() {
  /* ================== CARGA DINÁMICA DE CURSOS==============*/
  const contenedorCursos = document.querySelector(".courses-grid");

  if (!contenedorCursos) {
    console.warn("⚠️ No se encontró .courses-grid aún, reintentando...");
    return;
  }

  // Cargar archivo JSON con los cursos
  fetch("Sections/servicios.json")
  .then(response => response.json())
  .then(data => {
    generarServicio(data.servicios, data.contacto);
  })
  .catch(error => console.error("Error al cargar servicios.json:", error));
  /* ==============================================
   *      FUNCIÓN PARA GENERAR LAS TARJETAS DINÁMICAS
   *   ===============================================*/
  function generarServicio(listaServicio, contacto) {
    contenedorCursos.innerHTML = ""; // Limpia el contenedor
    const celular = contacto.celular.replace(/\D/g, "");

    listaServicio.forEach(servicio => {
      const titulo = servicio.titulo ?? "Sin título";
      const imagen = servicio.imagen ?? "img/default.jpg";
      const frase = servicio.frase ?? "No se encontro la frase";
      const recurso = servicio.recurso ?? "Modalidad no definida.";
      const beneficios = servicio.beneficios ?? "Sin fecha";
      const costo = servicio.costo ?? "Cotizacion en linea";

      const card = document.createElement("div");
      card.classList.add("course-card");
      const atributoLi = document.createElement("li");
      atributoLi.classList.add("box-elegante");


      atributoLi.textContent = beneficios;


      // Crear contenedor para la fecha dinámica
      const enlaceWhatsApp = `https://wa.me/${celular}?text=Info%20del%20servicio%20:%20${encodeURIComponent(titulo)}`;
      card.innerHTML = `
      <div class="card-img">
      <img src="${imagen}" alt="${titulo}" class="img-card">
      </div>
      <h3>${titulo}</h3>
      <p class="course-info">${frase}</p>
      <ul class="course-details">
      <li>${recurso}</li>
      <li>${costo}</li>
      </ul>
      <div class="qr-container">
      <img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(enlaceWhatsApp)}&size=300x300&ecc=Q&format=svg&margin=4" alt="QR WhatsApp" title="Hazme más grande" class="qr" data-curso='${titulo}'>
      <button class="course-btn" id="btnCotizar" data-titulo="${titulo}"> Cotizar </button>
      </div>
      `;
      card.querySelector(".course-details").appendChild(atributoLi);
      contenedorCursos.appendChild(card);
    });
  }
}



function esMovil() {
	return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function cargarQRsCursos() {
	document.addEventListener("click", e => {
	if (e.target.classList.contains("qr")) {
		if (esMovil()) {
			const curso = e.target.getAttribute("data-curso");
			fetch("Sections/cursos.json")
			.then(response => response.json())
			.then(data => {
				window.location.href = `https://wa.me/${data.contacto.celular.replace(/\D/g,'')}?text=${encodeURIComponent(`Hola Buenas Tardes, Necesito más información del curso: ${curso}`)}`;
			});
		}
		else {
			const modal = document.getElementById("qrModal");
			const qrBig = document.getElementById("qrBig");
			qrBig.src = e.target.src;
			modal.style.display = "flex";
		}
	}
	});
	document.getElementById("qrModal").addEventListener("click", () => {
		document.getElementById("qrModal").style.display = "none";

	});
}

function cargarQRsServ() {
  document.addEventListener("click", e => {
    if (e.target.classList.contains("qr")) {
      if (esMovil()) {
        const curso = e.target.getAttribute("data-curso");
        fetch("Sections/servicios.json")
        .then(response => response.json())
        .then(data => {
          window.location.href = `https://wa.me/${data.contacto.celular.replace(/\D/g,'')}?text=${encodeURIComponent(`Hola Buenas Tardes, Necesito más información del servicio: ${curso}`)}`;
        });
      }
      else {
        const modal = document.getElementById("qrModal");
        const qrBig = document.getElementById("qrBig");
        qrBig.src = e.target.src;
        modal.style.display = "flex";
      }
    }
  });
  document.getElementById("qrModal").addEventListener("click", () => {
    document.getElementById("qrModal").style.display = "none";

  });
}

async function cargarMisCursos() {
  const response = await fetch("Sections/cursos.json");
  const data = await response.json();
  const Miscursos = data.cursos;

  const Cursohoy = new Date();
  // Función para parsear fechas tipo "MM/DD/YYYY al MM/DD/YYYY"
  function parsearFechas(fechaStr) {
    const partes = fechaStr.split(" al ");
    if (partes.length !== 2) return null;

    // Convertir MM/DD/YYYY → Date
    function convertir(fechaTexto) {
      const [mes, dia, año] = fechaTexto.split("/");
      return new Date(parseInt(año), parseInt(mes) - 1, parseInt(dia));
    }

    const inicio = convertir(partes[0]);
    const fin = convertir(partes[1]);

    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
      return null;
    }
    return { inicio, fin };
  }

  // Filtrar cursos válidos
  const Validos = Miscursos.filter(Miscurso => {
    const fechas = parsearFechas(Miscurso.Fecha); // aquí debe ser Miscurso.Fecha
    if (!fechas) return false; // descarta "Periodo de Registro"

    const { inicio, fin } = fechas;
    const finConTolerancia = new Date(fin);
    finConTolerancia.setDate(finConTolerancia.getDate() + 7);

    const valido = inicio <= Cursohoy && Cursohoy <= finConTolerancia;
    return valido;
  });

  // Si hay cursos válidos, mostrar modal
  if (Validos.length > 0) {
	document.getElementById("cursoModal").innerHTML="";
	generarContenidoModal();
    const select = document.getElementById("cursoSelect");
    select.innerHTML = ""; // limpiar antes de agregar

    Validos.forEach(Miscurso => {
      const option = document.createElement("option");
      option.value = Miscurso.titulo;
      option.textContent = `${Miscurso.titulo}`;
	    option.dataset.acceso = Miscurso.acceso;
      option.dataset.id = Miscurso.ID;
	    option.dataset.hoja = Miscurso.gid;
      select.appendChild(option);
    });
    mostrarModal();
    document.getElementById("cursoBtn").onclick = async () => {
      let passValue = document.getElementById("passwordInput").value;
      if (passValue === "") { alert("❌ Codigo Proporcionado x Facilitador");
        return; // detiene la ejecución, no continúa
      }
      const resultado = await validarCodigo(passValue);
      if (!resultado.valido) {
        alert(resultado.mensaje);
        return;
      }
      passValue = 0;
      const selectedOption = select.options[select.selectedIndex];
      const cursoSeleccionado = selectedOption.value;
      const tipoacceso = selectedOption.dataset.acceso;
      const hoja = selectedOption.dataset.hoja;
      const IDcurso = selectedOption.dataset.id;

      // Guardar curso y ruta en localStorage
      localStorage.setItem("cursoSeleccionado", cursoSeleccionado);
      localStorage.setItem("tipoAcceso", tipoacceso);
      localStorage.setItem("hoja", hoja);
      localStorage.setItem("next", "login.html");
      localStorage.setItem("IDcurso", IDcurso);
      generarLlave2();
      window.location.href = localStorage.getItem("next");
    };
  }
  else {
	 document.getElementById("cursoModal").innerHTML="";
   generarContenidoModal();
   const select = document.getElementById("cursoSelect");
    select.innerHTML = ""; // limpiar antes de agregar

  Validos.forEach(Miscurso => {
     const option = document.createElement("option");
     option.value = "Sin Cursos en Proceso";
     option.textContent = "Sin Cursos en Proceso";
     select.appendChild(option);
  });
   document.getElementById("cursoModal").style.display = "none";
	}
}

function generarLlave2() {
    const llave = Math.random().toString(36).substring(2, 12).toUpperCase();
    const expiracion = Date.now() + 30 * 1000; // 10 segundos
    localStorage.setItem("codigoTemporal", JSON.stringify({ llave, expiracion }));
}

function generarContenidoModal() {
  const modal = document.getElementById("cursoModal");
  // Crear el select
  const select = document.createElement("select");
  select.id = "cursoSelect";
  // Crear el contenedor para input + botón
  const div = document.createElement("div");
  // Crear el input
  const input = document.createElement("input");
  input.type = "password";
  input.id = "passwordInput";
  input.name = "password";
  input.placeholder = "Ingresa Codigo";

  // Crear el botón
  const button = document.createElement("button");
  button.id = "cursoBtn";
  button.textContent = "Ir al curso";

  // Insertar input y botón dentro del div
  div.appendChild(input);
  div.appendChild(button);

  // Insertar select y div dentro del modal
  modal.appendChild(select);
  modal.appendChild(div);
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

async function cargarServiciosEnSelect() {
  const selectser = document.getElementById("servicio");
  if (!selectser) return;
  try {
    const response = await fetch("Sections/servicios.json");
    const data = await response.json();
    const contacto = data.contacto;
    data.servicios.forEach(servicio => {
      const option = document.createElement("option");
      option.value = servicio.titulo;
      option.textContent = servicio.titulo;
      selectser.appendChild(option);
    });
    const cursoGuardado = localStorage.getItem("cotizar");
    if (cursoGuardado) {
      selectser.value = cursoGuardado;
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

	function G_2e5r3r() {
		const container = document.getElementById("G91364");
		container.style.display = "block"; // mostrar el div
		container.innerHTML = "";
		const div1 = document.createElement("div");
		const div2 = document.createElement("div");
		const input = document.createElement("input");
		input.type = "password";
		input.placeholder = "Ingresa tu contraseña";
		input.id = "passwordInput";
		input.style.marginBottom = "10px";
  // Crear botón submit
		const submitBtn = document.createElement("button");
		submitBtn.textContent = "Generar";
		submitBtn.style.margin ="20px";
		submitBtn.id = "submitBtn";
	// Crear botón cancelar
		const cancelar = document.createElement("button");
		cancelar.textContent = "Cancelar";
		cancelar.style.margin = "20px";

		cancelar.addEventListener("click", () => {
			div2.remove(); // elimina el div dinámico
			div1.remove();
			container.style.display = "none"; // mostrar el div
		});
		div2.appendChild(input);
		div2.appendChild(submitBtn);
		div2.appendChild(cancelar);
		div1.appendChild(div2);
		container.appendChild(div1);
		div2.id = "formcode";
		div1.id = "overcode";
	}

	function applyConfig() {
		document.documentElement.style.setProperty("--background", config.background_color);
		document.documentElement.style.setProperty("--surface", config.surface_color);
		document.documentElement.style.setProperty("--text-color", config.text_color);
		document.documentElement.style.setProperty("--accent-primary", config.primary_action_color);
		document.documentElement.style.setProperty("--accent-secondary", config.secondary_action_color);
		document.getElementById("15793").addEventListener("click", G_2e5r3r);
	}

	function applyTema(){
    const horatema = new Date().getHours();
    if (horatema >= 7 && horatema < 19) {
        // De 7am a 7pm → modo claro
        isDarkMode = false;
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
    } else {
        // De 7pm a 7am → modo oscuro
        isDarkMode = true;
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
    }
    document.getElementById('themeToggle').textContent = isDarkMode ? '🌙' : '☀️';
	}
	applyTema();
	applyConfig();
	cargarLikns();
}

async function cargarLikns(){
	document.body.addEventListener("click", e => {
	const el = e.target.closest("[data-section]");
	if (el) {
		e.preventDefault();
		navigateToSection(el.dataset.section);
	}
	});

	document.body.addEventListener("click", e => {
	const target = e.target.closest(".SectionMisCursos");
		if (target) {
			e.preventDefault();
			cargarMisCursos();
		}
	});
    document.body.addEventListener("click", (e) => {
      if (e.target && e.target.matches("#btnInscribirme")) {
        localStorage.setItem("cursoSeleccionado", e.target.dataset.titulo);
        navigateToSection('Contacto');
      }
    });
    document.body.addEventListener("click", (e) => {
      if (e.target && e.target.matches("#btnCotizar")) {
        localStorage.setItem("cotizar", e.target.dataset.titulo);
        navigateToSection("Cotizar");
        setTimeout(() => cargarServiciosEnSelect(), 50);
      }
    });
}


export async function navigateToSection(sectionName) {
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
        mainSection.innerHTML = `<p style="color:red;">Error: No se encueUncaught SyntaxError: await is a reserved identifierntra la seccion: "${sectionName}".</p>`;
        console.error(error);
    }
    if (sectionName === "Cursos") {
		setTimeout(() => {
			cargarCursos();
			cargarQRsCursos(); // se ejecuta justo después
		}, 50);
	}
    if (sectionName === "Contacto") {
        setTimeout(() => cargarCursosEnSelect(), 50);
    }
    if (sectionName === "Proyectos" ) {
		setTimeout(() => cargarProyectos(), 50);
	}
	if (sectionName === "Servicios") {
        setTimeout(() => {
          cargarServicios();
          cargarQRsServ(); // se ejecuta justo después
        }, 50);
    }
    setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, 300);
}

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

function mostrarModal() {
  document.getElementById("cursoModal").style.display = "block";
  document.getElementById("overlaySecun").style.display = "block";
}

function ocultarModal() {
  document.getElementById("cursoModal").style.display = "none";
  document.getElementById("overlaySecun").style.display = "none";
}

export function cargarInicio() {

  /* ================= ZOOM ================= */

  let zoomLevel = 90;
  const zoomDisplay = document.getElementById("zoomLevel");
  const zoomIn = document.getElementById("zoomIn");
  const zoomOut = document.getElementById("zoomOut");

  if (zoomIn && zoomOut && zoomDisplay) {
    zoomIn.addEventListener("click", () => {
      zoomLevel += 10;
      document.body.style.zoom = zoomLevel + "%";
      zoomDisplay.textContent = zoomLevel + "%";
    });

    zoomOut.addEventListener("click", () => {
      zoomLevel = Math.max(50, zoomLevel - 10);
      document.body.style.zoom = zoomLevel + "%";
      zoomDisplay.textContent = zoomLevel + "%";
    });
  }


  /* ================= TEMA ================= */

  let isDarkMode = false;
  const themeToggle = document.getElementById("themeToggle");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      isDarkMode = !isDarkMode;

      if (isDarkMode) {
        document.body.classList.add("dark-mode");
        document.body.classList.remove("light-mode");
        themeToggle.textContent = "🌙";
      } else {
        document.body.classList.add("light-mode");
        document.body.classList.remove("dark-mode");
        themeToggle.textContent = "☀️";
      }
    });
  }


  /* ================= WHO CONTENT ================= */

  let whoData = {};

  fetch("Sections/Who-content.html")
    .then(res => res.text())
    .then(html => {

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;

      const items = tempDiv.querySelectorAll(".who-info");

      items.forEach(item => {
        const id = item.id;
        const title = item.querySelector("h2").textContent;
        const fullHTML = item.innerHTML;
        const contentOnly = fullHTML.replace(
          item.querySelector("h2").outerHTML,
          ""
        ).trim();

        whoData[id] = { title, text: contentOnly };
      });
    });


  /* ================= MODAL ================= */

  const whoCards = document.querySelectorAll(".who-card");
  const modal = document.getElementById("whoModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalText = document.getElementById("modalText");
  const modalClose = document.querySelector(".who-modal-close");

  if (whoCards && modal && modalTitle && modalText) {
    whoCards.forEach(card => {
      card.addEventListener("click", () => {
        const key = `item-${card.dataset.index}`;
        if (whoData[key]) {
          modalTitle.textContent = whoData[key].title;
          modalText.innerHTML = whoData[key].text;
          modal.classList.add("active");
        }
      });
    });

    if (modalClose) {
      modalClose.addEventListener("click", () =>
        modal.classList.remove("active")
      );
    }
  }
}

function initSidebar() {
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

  // Cerrar al hacer click en overlay (móvil o desktop)
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
    gestureEnabled = startX < 20; // solo desde borde izquierdo
  });

  document.addEventListener("touchmove", (e) => {
    if (!gestureEnabled) return;
    currentX = e.touches[0].clientX;
  });

  document.addEventListener("touchend", () => {
    if (!gestureEnabled) return;
    let diffX = currentX - startX;

    if (diffX > 50) { // deslizar derecha → abrir
      sidebar.classList.add("open");
      overlay.classList.add("open");
    }
    if (diffX < -50) { // deslizar izquierda → cerrar
      sidebar.classList.remove("open");
      overlay.classList.remove("open");
      mainContent.classList.remove("shifted");
    }
  });
}
