/**
 * Módulo para renderizar el curso completo con múltiples semanas
 * @param {Object} data - Datos del curso cargados desde JSON
 */

const main = document.getElementById("main-container");
let datosCursoGlobal = null;
let semanaActual = 1;
let diaActual = 1;

// Variables para el progreso (AGREGAR ESTO)
let progresoCurso = null;
let totalDias = 0;


/**
 * Limpia el panel de actividades
 */
function limpiarPanelActividades() {
  const panel = document.querySelector(".activities-panel");
  if (panel) panel.innerHTML = "";
}

/**
 * Renderiza la información del encabezado del curso
 * @param {Object} curso - Datos del curso
 */
function renderHeader(curso) {
  document.getElementById("curso-titulo").textContent = (localStorage.getItem("nombreAlumno") + " Estas en el curso: " + curso.titulo) || "No se encontro El titulo dle Curso";
  
  // Descripción con niveles
  const descripcion = document.getElementById("curso-descripcion");
  descripcion.innerHTML = `
  <div class="descripcion-objetivos">
    <div class="descripcion-item">
      <span class="descripcion-icon">🟢</span>
      <span class="descripcion-texto">${curso.descripcion}</span>
    </div>
    <div class="descripcion-item">
      <span class="descripcion-icon">🔴</span>
      <span class="descripcion-texto">Objetivo general: ${curso.Objetivo2}</span>
    </div>
    <div class="descripcion-item">
      <span class="descripcion-icon">🟣</span>
      <span class="descripcion-texto">Perfil Egresado: ${curso.PerfilEgre}</span>
    </div>
  </div>
`;
}

/**
 * Obtiene todas las semanas disponibles en los datos
 * @param {Object} data - Datos completos del curso
 * @returns {Array} - Array de objetos {nombre: string, dias: array, indice: number}
 */
function obtenerSemanas(data) {
  const semanas = [];
  
  // Buscar todas las propiedades que comiencen con "Semana" (Semana1, Semana2, etc.)
  Object.keys(data).forEach(key => {
    if (key.startsWith('Semana') && Array.isArray(data[key])) {
      const indice = parseInt(key.replace('Semana', ''));
      semanas.push({
        nombre: key,
        indice: indice,
        dias: data[key]
      });
    }
  });
  
  // Ordenar semanas por número (Semana1, Semana2, etc.)
  semanas.sort((a, b) => a.indice - b.indice);
  
  return semanas;
}

/**
 * Renderiza todas las semanas en la línea de tiempo
 * @param {Array} semanas - Array de objetos semana
 */
function renderTimeline(semanas) {
  const timelineContainer = document.getElementById("timeline-container");
  timelineContainer.innerHTML = '';
  
  semanas.forEach((semana) => {
    // Crear contenedor de semana
    const semanaContainer = document.createElement("div");
    semanaContainer.className = "semana-container";
    semanaContainer.dataset.semana = semana.indice;
    
    // Título de la semana
    const semanaTitulo = document.createElement("h3");
    semanaTitulo.className = "semana-titulo";
    semanaTitulo.textContent = `Semana ${semana.indice}`;
    semanaContainer.appendChild(semanaTitulo);
    
    // Contenedor de días de la semana
    const diasContainer = document.createElement("div");
    diasContainer.className = "semana-dias";
    
    // Determinar si el último elemento es soporte
    const ultimoElemento = semana.dias[semana.dias.length - 1];
    const tieneSoporte = ultimoElemento && ultimoElemento.soporte;
    const diasARenderizar = tieneSoporte ? semana.dias.slice(0, -1) : semana.dias;
    
    // Renderizar cada día de la semana (excluyendo el soporte)
    diasARenderizar.forEach((dia) => {
      const diaCard = document.createElement("div");
      diaCard.className = "day-card";
      diaCard.dataset.dia = dia.dia;
      diaCard.dataset.semana = semana.indice;
      diaCard.dataset.titulo = dia.titulo;
      diaCard.dataset.descripcion = dia.descripcion;
      
      const habilitado = progresoCurso ? diaHabilitado(dia.dia, progresoCurso) : dia.dia === 1;

      diaCard.innerHTML = `
        <h4>${dia.titulo}</h4>
        <p>${dia.descripcion}</p>
        <button class="open-btn ${habilitado ? '' : 'disabled'}" 
                data-semana="${semana.indice}" 
                data-dia="${dia.dia}"
                ${habilitado ? '' : 'disabled'}>
          ${habilitado ? 'Abrir' : '🔒 Bloqueado'}
        </button>
      `;

      // Solo agregar event listener si está habilitado
      if (habilitado) {
        const btnAbrir = diaCard.querySelector('.open-btn');
        btnAbrir.addEventListener('click', (e) => {
          e.stopPropagation();
          seleccionarDiaPorSemana(semana.indice, dia.dia, semanas);
        });
      }
      
      diasContainer.appendChild(diaCard);
    });
    
    semanaContainer.appendChild(diasContainer);
    // ==== AGREGAR SOPORTE SI EXISTE ====
    if (tieneSoporte) {
      const soporteDiv = document.createElement("div");
      soporteDiv.className = "soporte-semana";
      soporteDiv.innerHTML = `
        <a href="${ultimoElemento.soporte}" target="_blank" class="soporte-link">
          📄 Soporte de la semana ${semana.indice}
        </a>
      `;
      semanaContainer.appendChild(soporteDiv);
    }
    // ==== FIN SOPORTE ====
    
    timelineContainer.appendChild(semanaContainer);
  });
}

/**
 * Selecciona un día por semana y número de día
 * @param {number} indiceSemana - Índice de la semana
 * @param {number} numeroDia - Número del día
 * @param {Array} semanas - Array de todas las semanas
 */
function seleccionarDiaPorSemana(indiceSemana, numeroDia, semanas) {
  // Encontrar la semana correspondiente
  const semana = semanas.find(s => s.indice === indiceSemana);
  
  if (!semana) {
    console.error(`No se encontró la semana ${indiceSemana}`);
    return;
  }
  
  // Encontrar el día correspondiente en esa semana
  const dia = semana.dias.find(d => d.dia === numeroDia);
  
  if (!dia) {
    console.error(`No se encontró el día ${numeroDia} en la semana ${indiceSemana}`);
    return;
  }
  
  semanaActual = indiceSemana;
  diaActual = numeroDia;
  
  // Actualizar visual del timeline (marcar día activo)
  document.querySelectorAll('.day-card').forEach(card => {
    if (parseInt(card.dataset.semana) === indiceSemana && parseInt(card.dataset.dia) === numeroDia) {
      card.classList.add('activo');
    } else {
      card.classList.remove('activo');
    }
  });
  
 // También marcar la semana activa (opcional)
document.querySelectorAll('.semana-container').forEach(container => {
  if (parseInt(container.dataset.semana) === indiceSemana) {
    container.classList.add('semana-activa');  // ← CORREGIDO
  } else {
    container.classList.remove('semana-activa');
  }
});
  
  renderPanelDia(dia, indiceSemana);
}

/**
 * Renderiza el panel de actividades de un día específico
 * @param {Object} dia - Datos del día
 * @param {number} numSemana - Número de semana
 */
function renderPanelDia(dia, numSemana) {
    const dayPanel = document.getElementById("day-panel");
    
    // Mostrar el panel
    dayPanel.style.display = "block";
    
    // 1. GENERAR TODO EL CONTENIDO DEL PANEL (header + contenedor de actividades)
    dayPanel.innerHTML = `
      <div class="panel-header">
        <h3 id="panel-title">
          <span class="semana-indicador">Semana ${numSemana}</span>
          <span class="dia-titulo">${dia.titulo}</span>
        </h3>
        <div class="panel-actions">
          <button class="primary" id="start-day-btn">Iniciar día</button>
          <button class="success" id="finish-day-btn" ${dia.dia === progresoCurso?.diaActual ? '' : 'disabled'}> 
            ${dia.dia === progresoCurso?.diaActual ? '¡Todos terminamos!' : '✅ Completado'}
          </button>
        </div>
      </div>
      <div class="activities-list" id="activities-list">
        <!-- Las actividades se llenarán aquí -->
      </div>
    `;
    
    // 2. AHORA OBTENER REFERENCIA AL activities-list (ya existe porque lo creamos arriba)
    const activitiesList = document.getElementById("activities-list");
    
    // 3. LIMPIAR Y RENDERIZAR CADA ACTIVIDAD (ESTA PARTE LA CONSERVAS IGUAL)
    activitiesList.innerHTML = '';
    
    // Renderizar cada actividad
    dia.actividades.forEach((actividad) => {
      const actividadCard = document.createElement("div");
      actividadCard.className = `activity-card ${actividad.tipo}`;
      
      // Construir descripción con niveles
      let descripcionNiveles = actividad.descripcion;
      let nivelesTexto = '';
      if (actividad.niveles && actividad.niveles.length > 0) {
        nivelesTexto = actividad.niveles
          .map((nivel, index) => {
            const circulos = ['🔴', '🟣', '🔵'];
            return `${circulos[index]} ${nivel}`;
          })
          .join(' · ');
      }
      // ===== CONSTRUIR LOS TRES TIPOS DE ENLACES =====
      
      // 1. Enlaces principales (izquierda)
      const enlacesPrincipalesHTML = actividad.enlaces && actividad.enlaces.length > 0 
        ? actividad.enlaces.map(e => `<a href="${e.url}" target="_blank" class="enlace-principal">${e.texto || e.etiqueta || '🔗 Enlace'}</a>`).join('')
        : '';
      
      // 2. Enlaces de respaldo (centro)
      const enlacesRespaldoHTML = actividad.enlaces_de_respaldo && actividad.enlaces_de_respaldo.length > 0 
        ? actividad.enlaces_de_respaldo.map(e => `<a href="${e.url}" target="_blank" class="enlace-respaldo">${e.texto || e.etiqueta || '📦 Respaldo'}</a>`).join('')
        : '';
      
      // 3. Enlaces de videos (derecha)
      const enlacesVideosHTML = actividad.enlaces_videos && actividad.enlaces_videos.length > 0 
        ? actividad.enlaces_videos.map(e => `<a href="${e.url}" target="_blank" class="enlace-video">${e.texto || e.etiqueta || '🎥 Video'}</a>`).join('')
        : '';
      
      // Construir la tarjeta con enlaces al mismo nivel que content y actions
      actividadCard.innerHTML = `
        <div class="activity-content">
          <h4 class="activity-title">${actividad.titulo}</h4>
          <p class="activity-meta">${descripcionNiveles}</p>
          <p class="activity-meta">${nivelesTexto ? `<div>${nivelesTexto}</div>` : ''}</p>
        </div>
        <div class="activity-actions">
          <span class="timer-badge">${actividad.duracionMin} min</span>
          <button class="secondary btn-iniciar-temporizador" data-duracion="${actividad.duracionMin}">
            Iniciar temporizador
          </button>
        </div>
        <!-- Enlaces ahora están al mismo nivel que content y actions -->
        <div class="enlaces-container">
          <div class="enlaces-izquierda">
            ${enlacesPrincipalesHTML ? `<div class="enlaces-grupo">${enlacesPrincipalesHTML}</div>` : ''}
          </div>
          <div class="enlaces-centro">
            ${enlacesRespaldoHTML ? `<div class="enlaces-grupo">${enlacesRespaldoHTML}</div>` : ''}
          </div>
          <div class="enlaces-derecha">
            ${enlacesVideosHTML ? `<div class="enlaces-grupo">${enlacesVideosHTML}</div>` : ''}
          </div>
        </div>
      `;
      activitiesList.appendChild(actividadCard);
    });
    
    // Agregar juego de cierre si existe
    if (dia.juegoCierre) {
      const juegoCierreCard = document.createElement("div");
      juegoCierreCard.className = "activity-card juego-cierre";
      juegoCierreCard.innerHTML = `
        <h4>Juego de cierre (máx. ${dia.juegoCierre.duracionMin} min)</h4>
        <p>${dia.juegoCierre.descripcion}</p>
        <div class="app-footer">
          <button class="btn-iniciar-juego-cierre" id="iniciar-juego-cierre">
            Iniciar juego de cierre
          </button>
          <a href="${dia.juegoCierre.enlace}" target="_blank" class="btn-abrir-juego">
            Abrir juego
          </a>
        </div>
      `;
      activitiesList.appendChild(juegoCierreCard);
    }
    
    // 4. CONFIGURAR EVENT LISTENERS (después de que los elementos existen)
    document.getElementById("start-day-btn")?.addEventListener('click', () => {
      iniciarDia(dia);
    });
    
    document.getElementById("finish-day-btn")?.addEventListener('click', () => {
      completarDia(dia, numSemana);
    });
    
    // Configurar temporizadores (necesitas selector más específico o re-asignar)
    document.querySelectorAll('.btn-iniciar-temporizador').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const duracion = parseInt(e.target.dataset.duracion);
        iniciarTemporizador(duracion);
      });
    });
    
    document.getElementById("iniciar-juego-cierre")?.addEventListener('click', () => {
      if (dia.juegoCierre) {
        iniciarTemporizador(dia.juegoCierre.duracionMin);
      }
    });
    if (encuestaURL) { 
      // ==== BLOQUE DE ENCUESTA (último día REAL de última semana) ====
      const semanas = obtenerSemanas(datosCursoGlobal);
      const semanaActual = semanas.find(s => s.indice === numSemana);
      const esUltimaSemana = numSemana === semanas.length;

      // Filtrar SOLO los elementos que tienen propiedad 'dia' (ignorar soporte)
      const diasReales = semanaActual.dias.filter(d => d.hasOwnProperty('dia'));
      const diasNumeros = diasReales.map(d => d.dia);
      const ultimoDiaReal = Math.max(...diasNumeros);

      const esUltimoDia = esUltimaSemana && dia.dia === ultimoDiaReal;

      if (esUltimoDia) {
        const encuestaURL = localStorage.getItem("cursoEncuesta");
        
        if (encuestaURL) {
          const encuestaCard = document.createElement("div");
          encuestaCard.className = "activity-card encuesta-card";
          encuestaCard.innerHTML = `
            <p>De acuerdo al EC0366, Desarrollo de cursos de formación en línea, Consteste la siguiente evaluación y encuesta de satisfacción</p>
            <div class="enlaces-container">
              <div class="enlaces-izquierda">
                <div class="enlaces-grupo"><a class="enlace-principal"  href="${encuestaURL}" target="_blank"> EC0366: Evaluación/Encuesta </a></div>
              </div>            
            </div>
          `;
          activitiesList.appendChild(encuestaCard);
        }
      }
    }
    // ==== FIN BLOQUE ENCUESTA ====
}

/**
 * Inicia el día (puede activar temporizador general)
 * @param {Object} dia - Datos del día
 */
function iniciarDia(dia) {
  // Calcular duración total del día
  let duracionTotal = dia.actividades.reduce((total, act) => total + act.duracionMin, 0);
  if (dia.juegoCierre) {
    duracionTotal += dia.juegoCierre.duracionMin;
  }
  
  console.log(`Iniciando día ${dia.dia} - Duración total: ${duracionTotal} min`);
}
/**
 * Marca el día como completado
 * @param {Object} dia - Datos del día
 * @param {number} numSemana - Número de semana
 */
function completarDia(dia, numSemana) {
  // Avanzar al siguiente día si hay progreso inicializado
  if (progresoCurso && totalDias > 0) {
    progresoCurso = avanzarDia(progresoCurso, totalDias);
    
    // Re-renderizar timeline para actualizar botones
    const semanasActualizadas = obtenerSemanas(datosCursoGlobal);
    renderTimeline(semanasActualizadas);
  } else {
    // Comportamiento anterior (solo desbloquear visualmente)
    const siguienteDia = dia.dia + 1;
    const siguienteCard = document.querySelector(`.day-card[data-semana="${numSemana}"][data-dia="${siguienteDia}"]`);
    
    if (siguienteCard) {
      siguienteCard.classList.remove('bloqueado');
    } else {
      const siguienteSemana = numSemana + 1;
      const primerDiaSiguienteSemana = document.querySelector(`.day-card[data-semana="${siguienteSemana}"][data-dia="1"]`);
      if (primerDiaSiguienteSemana) {
        primerDiaSiguienteSemana.classList.remove('bloqueado');
      }
    }
  }
  
  // Mostrar overlay de felicitación
  mostrarOverlayFelicitacion();
}

/**
 * Inicia el temporizador para una actividad
 * @param {number} duracionMin - Duración en minutos
 */
function iniciarTemporizador(duracionMin) {
  const overlay = document.getElementById("slime-overlay");
  const fill = document.querySelector(".slime-fill");
  const minSpan = document.getElementById("countdown-min");
  const secSpan = document.getElementById("countdown-sec");
  const closeBtn = document.getElementById("close-slime-btn");
  
  // Activar modo esquina
  overlay.classList.remove("hidden");
  overlay.classList.add("temporizador-activo");
  
  // Ocultar botón de cerrar inicialmente
  closeBtn.style.display = "none";
  
  let segundosTotales = duracionMin * 60;
  let segundosRestantes = segundosTotales;
  
  const intervalo = setInterval(() => {
    segundosRestantes--;
    
    const minutos = Math.floor(segundosRestantes / 60);
    const segundos = segundosRestantes % 60;
    
    minSpan.textContent = minutos.toString().padStart(2, '0');
    secSpan.textContent = segundos.toString().padStart(2, '0');
    
    const progreso = ((segundosTotales - segundosRestantes) / segundosTotales) * 100;
    fill.style.height = `${progreso}%`;
    
    // Cuando llegue a cero
    if (segundosRestantes <= 0) {
      clearInterval(intervalo);
      
      // Mostrar botón de cerrar
      closeBtn.style.display = "block";
      overlay.classList.add("temporizador-completado");
      
      // ===== CREAR MANTO OSCURO =====
      const manto = document.createElement("div");
      manto.className = "manto-bloqueo";
      manto.id = "manto-temporizador";
      document.body.appendChild(manto);
      
      // Opcional: impedir scroll
      document.body.style.overflow = "hidden";
    }
  }, 1000);
  
  // Botón cerrar - AHORA TAMBIÉN ELIMINA EL MANTO
  closeBtn.onclick = () => {
    clearInterval(intervalo);
    overlay.classList.add("hidden");
    overlay.classList.remove("temporizador-activo", "temporizador-completado");
    closeBtn.style.display = "none";
    
    // ===== ELIMINAR MANTO OSCURO =====
    const manto = document.getElementById("manto-temporizador");
    if (manto) {
      manto.remove();
    }
    
    // Restaurar scroll
    document.body.style.overflow = "";
  };
}

/**
 * Renderiza la pantalla de bienvenida en el day-panel
 * @param {Object} curso - Datos del curso
 * @param {Array} semanas - Array de semanas
 */
function renderBienvenida(curso, semanas) {
  const dayPanel = document.getElementById("day-panel");
  
  // Calcular total de semanas y días
  const totalSemanas = semanas.length;
  const totalDias = semanas.reduce((acc, semana) => acc + semana.dias.length, 0);
  
  // Generar HTML de bienvenida
  dayPanel.innerHTML = `
    <div class="bienvenida-container">
      <div class="bienvenida-header">
        <h2>🎓 ${curso.titulo}</h2>
        <div class="bienvenida-badge">${totalSemanas} semana${totalSemanas !== 1 ? 's' : ''} · ${totalDias} día${totalDias !== 1 ? 's' : ''}</div>
      </div>
      
      <div class="bienvenida-content">
        <div class="bienvenida-mensaje">
          <p>👋 ¡Hola! <strong> ${localStorage.getItem("nombreAlumno")} </strong> Te damos la bienvenida a esta experiencia de aprendizaje.</p>
          <p>Este curso está diseñado para que aprendas mientras te diviertes, con actividades interactivas y retos por niveles.</p>
        </div>
        
        <div class="bienvenida-info">
          <div class="info-card">
            <span class="info-icon">📅</span>
            <div>
              <strong>Duración:</strong> ${totalSemanas} semana${totalSemanas !== 1 ? 's' : ''} (${totalDias} días)
            </div>
          </div>
          <div class="info-card">
            <span class="info-icon">👨‍🏫</span>
            <div>
              <strong>Facilitador:</strong> Marcos Moreno
            </div>
          </div>
          <div class="info-card">
            <span class="info-icon">💬</span>
            <div>
              <strong>¿Dudas?</strong> Con gusto te ayudaremos
            </div>
          </div>
        </div>
        
        <div class="bienvenida-mensaje-destacado">
          <p>✨ Esperamos que las actividades sean de tu agrado. Recuerda que tu retroalimentación es muy importante para mejorar día a día.</p>
          <p>🤝 Con tu ayuda y participación, podemos hacer crecer esta nueva comunidad de innovadores y estudiantes tecnológicos.</p>
        </div>
        <div class="courses-grid">
        <div class="bienvenida-footer">
          <p>👆 <strong>Selecciona un día en la línea de tiempo para comenzar</strong></p>
        </div>
      </div>
    </div>
  `;
  // Mostrar el panel
  dayPanel.style.display = "block";
}

/**
 * Muestra el overlay de felicitación
 */
function mostrarOverlayFelicitacion() {
  const overlay = document.getElementById("congrats-overlay");
  overlay.classList.remove("hidden");
  
  document.getElementById("close-congrats-btn").onclick = () => {
    overlay.classList.add("hidden");
  };
}

/**
 * Función principal para renderizar el curso
 * @param {Object} data - Datos del curso
 */
export function renderCurso(data) {
  if (!data) {
    console.error("Datos de curso inválidos");
    return;
  }
  
  datosCursoGlobal = data;
  
  // Obtener todas las semanas disponibles
  const semanas = obtenerSemanas(data);
  
  if (semanas.length === 0) {
    console.error("No se encontraron semanas en los datos");
    return;
  }
  
  // Calcular total de días
  totalDias = semanas.reduce((acc, semana) => acc + semana.dias.length, 0);
  
  // Inicializar progreso
  progresoCurso = inicializarProgreso(data);
  console.log(`📚 Curso cargado con ${semanas.length} semanas`);
  console.log(`🎯 Día actual: ${progresoCurso.diaActual}`);
  
  // Limpiar contenedor principal
  //main.innerHTML = "";
  
  // Renderizar header
  renderHeader(data.curso);
  
  // Renderizar timeline con múltiples semanas (PASA semanas como argumento)
  renderTimeline(semanas);
  
  // MOSTRAR BIENVENIDA EN EL PANEL
  renderBienvenida(data.curso, semanas);

  // Configurar botones de acciones generales
  configurarBotonesPanel();
  cargarCard();
}

/**
 * Configura los botones del panel de acciones
 */
function configurarBotonesPanel() {
  const panelActions = document.querySelector(".panel-actions");
  if (!panelActions) return;
  
  panelActions.innerHTML = '';
  
  // Botón de constancia (si está configurado)
  if (datosCursoGlobal?.configuracion?.mostrarConstanciaFinal) {
    const constanciaBtn = document.createElement("button");
    constanciaBtn.className = "btn-constancia";
    constanciaBtn.textContent = "🎓 Ver constancia";
    constanciaBtn.onclick = mostrarConstancia;
    panelActions.appendChild(constanciaBtn);
  }
}

/**
 * Muestra la constancia de participación
 */
function mostrarConstancia() {
  if (!datosCursoGlobal?.curso?.constancia) return;
  
  const constancia = datosCursoGlobal.curso.constancia;
  mostrarOverlayPersonalizado(constancia.titulo, constancia.texto);
}

/**
 * Muestra un overlay personalizado
 * @param {string} titulo - Título del overlay
 * @param {string} mensaje - Mensaje a mostrar
 */
function mostrarOverlayPersonalizado(titulo, mensaje) {
  // Reutilizar overlay de felicitación
  const overlay = document.getElementById("congrats-overlay");
  const titleEl = overlay.querySelector('h2');
  const textEl = overlay.querySelector('p');
  
  titleEl.textContent = titulo;
  textEl.textContent = mensaje;
  
  overlay.classList.remove("hidden");
  
  document.getElementById("close-congrats-btn").onclick = () => {
    overlay.classList.add("hidden");
    // Restaurar texto original
    titleEl.textContent = "¡Felicidades! Nivel superado 🎉";
    textEl.textContent = "Has completado este día. Se desbloquea el siguiente en la línea de tiempo.";
  };
}


function cargarCard() {
  /* ================== CARGA DINÁMICA DE CURSOS ==============*/
  const contenedorCursos = document.querySelector(".courses-grid");

  if (!contenedorCursos) {
    console.warn("⚠️ No se encontró .courses-grid aún, reintentando...");
    return;
  }

  // Obtener ID del curso desde localStorage
  const idCursoGuardado = localStorage.getItem("IDcurso");
  
  if (!idCursoGuardado) {
    console.error("❌ No hay ID de curso en localStorage");
    contenedorCursos.innerHTML = `<p class="error-mensaje">No se ha seleccionado ningún curso.</p>`;
    return;
  }

  console.log(`🔍 Buscando curso con ID: ${idCursoGuardado}`);

  // Cargar archivo JSON con los cursos
  fetch("../Sections/cursos.json")
    .then(response => response.json())
    .then(data => {
  // Buscar SOLO el curso que coincida con el ID guardado (usando c.ID con mayúscula)
    const cursoSeleccionado = data.cursos.find(c => c.ID === idCursoGuardado);
    if (!cursoSeleccionado) {
      console.error(`❌ No se encontró curso con ID: ${idCursoGuardado}`);
      contenedorCursos.innerHTML = `<p class="error-mensaje">Curso no encontrado.</p>`;
      return;
    }
    localStorage.setItem("cursoEncuesta",cursoSeleccionado.Encuesta); 
    console.log(`✅ Curso encontrado: ${cursoSeleccionado.titulo}`);
      // Generar SOLO una tarjeta con el curso filtrado
      generarTarjetaUnica(cursoSeleccionado, data.contacto);
    })
    .catch(error => {
      console.error("Error al cargar cursos.json:", error);
      contenedorCursos.innerHTML = `<p class="error-mensaje">Error al cargar los cursos.</p>`;
    });
  
  /* ==============================================
     FUNCIÓN PARA GENERAR UNA SOLA TARJETA
  ===============================================*/
  function generarTarjetaUnica(curso, contacto) {
    contenedorCursos.innerHTML = ""; // Limpia el contenedor
    
    const celular = contacto.celular.replace(/\D/g, "");
    const titulo = curso.titulo ?? "Sin título";
    const base = window.location.pathname.split('/')[1];
    const imagen = `/${base}/${curso.imagen}`;
    const duracion = curso.duracion ?? "Duración no especificada.";
    const modalidad = curso.modalidad ?? "Modalidad no definida.";
    const fechaTexto = curso.Fecha ?? "Sin fecha";

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
      } else {
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
      <p class="course-info">${curso.frase || ''}</p>
      <ul class="course-details">
        <li>${duracion}</li>
        <li>${curso.material || ''}</li>
        <li>${curso.modalidad === "Presencial" ? "🏫" : "💻"} Modalidad: ${modalidad}</li>
      </ul>
      <div class="qr-container">
        <img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(enlaceWhatsApp)}&size=300x300&ecc=Q&format=svg&margin=4" alt="QR WhatsApp" title="Hazme más grande" class="qr" data-curso='${titulo}'>
      </div>
    `;
    
    // Insertar la fecha dinámica en la lista
    card.querySelector(".course-details").appendChild(fechaLi);
    contenedorCursos.appendChild(card);
  }
}

/**
 * Módulo de gestión de progreso del curso
 * Guarda en localStorage el día actual y habilita botones según el progreso
 */

const PROGRESO_KEY = "curso_progreso";

// Estructura del progreso guardado
const estructuraProgreso = {
  diaActual: 1,
  ultimoDiaCompletado: 0,
  fechaInicio: null,
  fechaUltimoAcceso: null
};

/**
 * Inicializa o carga el progreso desde localStorage
 * @param {Object} cursoData - Datos del curso (para saber total de días)
 * @returns {Object} Progreso actual
 */
export function inicializarProgreso(cursoData) {
  try {
    // Obtener ID del curso desde localStorage
    const idCurso = localStorage.getItem("IDcurso");
    
    if (!idCurso) {
      console.warn("No hay ID de curso, usando progreso por defecto");
      return estructuraProgreso;
    }
    
    // Clave única por curso (para tener progreso independiente por curso)
    const claveProgreso = `${PROGRESO_KEY}_${idCurso}`;
    
    // Intentar cargar progreso guardado
    const progresoGuardado = localStorage.getItem(claveProgreso);
    
    if (progresoGuardado) {
      const progreso = JSON.parse(progresoGuardado);
      console.log(`📊 Progreso cargado: Día ${progreso.diaActual}`);
      return progreso;
    } else {
      // Si no hay progreso, crear uno nuevo
      const nuevoProgreso = {
        diaActual: 1,
        ultimoDiaCompletado: 0,
        fechaInicio: new Date().toISOString(),
        fechaUltimoAcceso: new Date().toISOString(),
        idCurso: idCurso
      };
      
      guardarProgreso(nuevoProgreso);
      console.log("🆕 Nuevo progreso inicializado");
      return nuevoProgreso;
    }
  } catch (error) {
    console.error("Error al inicializar progreso:", error);
    return estructuraProgreso;
  }
}

/**
 * Guarda el progreso en localStorage
 * @param {Object} progreso - Objeto con el progreso actual
 */
export function guardarProgreso(progreso) {
  try {
    const idCurso = localStorage.getItem("IDcurso");
    if (!idCurso) return;
    
    const claveProgreso = `${PROGRESO_KEY}_${idCurso}`;
    progreso.fechaUltimoAcceso = new Date().toISOString();
    
    localStorage.setItem(claveProgreso, JSON.stringify(progreso));
    console.log(`💾 Progreso guardado: Día ${progreso.diaActual}`);
  } catch (error) {
    console.error("Error al guardar progreso:", error);
  }
}

/**
 * Avanza al siguiente día
 * @param {Object} progreso - Progreso actual
 * @param {number} totalDias - Total de días del curso
 * @returns {Object} Nuevo progreso
 */
export function avanzarDia(progreso, totalDias) {
  if (progreso.diaActual < totalDias) {
    progreso.ultimoDiaCompletado = progreso.diaActual;
    progreso.diaActual += 1;
    guardarProgreso(progreso);
    console.log(`➡️ Avanzando al día ${progreso.diaActual}`);
  } else {
    console.log("🏁 Curso completado");
  }
  return progreso;
}

/**
 * Reinicia el progreso del curso
 */
export function reiniciarProgreso() {
  const idCurso = localStorage.getItem("IDcurso");
  if (idCurso) {
    const claveProgreso = `${PROGRESO_KEY}_${idCurso}`;
    localStorage.removeItem(claveProgreso);
    console.log("🔄 Progreso reiniciado");
  }
}

/**
 * Verifica si un día específico está habilitado
 * @param {number} dia - Número de día a verificar
 * @param {Object} progreso - Progreso actual
 * @returns {boolean} true si está habilitado
 */
export function diaHabilitado(dia, progreso) {
  return dia <= progreso.diaActual;
}