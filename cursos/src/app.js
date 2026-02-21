import { mostrarLoader } from "./loader.js";
import { renderCurso } from './renderCurso.js';


// Llamamos al loader al inicio
mostrarLoader(3, "#1e90ff");

/* ================================
   CONFIGURACIÓN BASE
================================ */
const basePath = (() => {
  const path = window.location.pathname;
  return path.includes('InnBot') ? '/InnBot/' : '/ZM/';
})();

/* ================================
   RUTAS GLOBALES
================================ */
const RUTA_CURSOS = `${basePath}Cursos_json/`;
const PAGINA_RAIZ = `${basePath}`;

window.addEventListener("DOMContentLoaded", iniciarAplicacion);
async function iniciarAplicacion() {
  try {
    validarLlaveAcceso();
    //localStorage.setItem("IDcurso", "KMP")
    const cursoId = localStorage.getItem("IDcurso");
    if (!cursoId) {
      redirigir("No hay curso activo");
      return;
    }
   const response = await fetch(`${RUTA_CURSOS}${cursoId}.json`);
    if (!response.ok) {
      throw new Error("No se encontró el curso");
    }
    const datosCurso = await response.json();
    renderCurso(datosCurso);
   
  } catch (error) {
    console.error(error);
    mostrarError(error.message);
  }
}

/* ================================
   VALIDACIÓN DE ACCESO
================================ */
function validarLlaveAcceso() {
  const data = localStorage.getItem("llaveAcceso");
  if (!data) {
    redirigir("Acceso no autorizado ❌");
    return false;
  }
  const { llave, expiracion } = JSON.parse(data);
  if (Date.now() > expiracion) {
    return false;
  }
  // Uso único
  localStorage.removeItem("llaveAcceso");
  return true;
}


/* ================================
   MANEJO DE ERRORES
================================ */
function mostrarError(mensaje) {
  document.body.innerHTML = `
    <div style="
      min-height:100vh;
      display:flex;
      align-items:center;
      justify-content:center;
      background:#0b1220;
      color:#e5e7eb;
      font-family:system-ui;
      text-align:center;
      padding:24px;
    ">
      <div>
        <h2>Error</h2>
        <p>${mensaje}</p>
        <small>Serás redirigido automáticamente…</small>
      </div>
    </div>
  `;

  setTimeout(() => {
    localStorage.clear(); // opcional si quieres limpiar todo
    window.location.href = PAGINA_RAIZ;
  }, 4000);
}

function redirigir(mensaje) {
  mostrarError(mensaje);
}