import { obtenerUrl } from "./Sections/ScriptForm.js";
let nombreSeleccionado = null;
let edadSeleccionada = null;
const tipoAcceso = localStorage.getItem("tipoAcceso"); // "codigo" o "Libre"

const homepath = (() => {
  const path = window.location.pathname;
  return path.includes('InnBot') ? '/InnBot/' : '/ZM/';
})();

document.getElementById("TituloCurso").textContent=localStorage.getItem("cursoSeleccionado");

// Mostrar campo password si es acceso por código
if (tipoAcceso === "Codigo") {
  document.getElementById("zonaPassword").style.display = "block";
  document.getElementById("tituloEdades").style.display = "none";
  document.getElementById("edades").style.display = "none";
}

function validarLlave2() {
  const data2 = localStorage.getItem("codigoTemporal");
  if (!data2) {
    // Mensaje de debug mostrando qué hay en localStorage
    document.body.innerHTML = ` <p>Acceso no autorizado ❌</p> <small>Serás redirigido automáticamente…</small>
    `;
    setTimeout(() => {
      localStorage.clear(); // opcional si quieres limpiar todo
      window.location.replace(homepath);
    }, 5000); // 5 segundos para que puedas leer el mensaje
    return false;
  }
  const { llave, expiracion } = JSON.parse(data2);
  // Validar expiración
  if (Date.now() > expiracion) {
    document.body.innerHTML = "Llave expirada";
    localStorage.removeItem("codigoTemporal"); // eliminar llave expirada
    setTimeout(() => {
      localStorage.clear(); // opcional si quieres limpiar todo
      window.location.replace(homepath);
    }, 5000);
    return false;
  }
  // ✅ Llave válida, eliminarla para un solo uso
  localStorage.removeItem("codigoTemporal");
  return true;
}


async function cargarNombres() {
  try {
    document.getElementById("mensaje").textContent = "Cargando nombres...";
    if(validarLlave2()){
      const gid = localStorage.getItem("hoja");
      const baseUrl = await obtenerUrl("url/dire"); // espera a que se resuelva
      const url = `${baseUrl}?gid=${gid}&single=true&output=csv`;
      const response = await fetch(url);
      const csvText = await response.text();
      const rows = csvText.split("\n").map(r => r.split(","));
      const headers = rows[0];
      const data = rows.slice(1).map(row => {
        let obj = {};
        headers.forEach((h, i) => obj[h.trim()] = row[i]?.trim());
        return obj;
      });
      localStorage.removeItem("hoja");
      window.alumnosData = data;
      const contenedor = document.getElementById("tarjetas");
      data.forEach(u => {
        const card = document.createElement("div");
        card.className = "tarjeta";
        card.textContent = u.Nombre;
        card.addEventListener("click", () => {
          document.querySelectorAll(".tarjeta").forEach(t => t.classList.remove("seleccionada"));
          card.classList.add("seleccionada");
          nombreSeleccionado = u.Nombre;
        });
        contenedor.appendChild(card);
      });
      document.getElementById("mensaje").textContent = "";
      const cantidad = data.length;
      const columnas = Math.min(cantidad, 4); // máximo 4 columnas
      contenedor.style.gridTemplateColumns = `repeat(${columnas}, 120px)`;
      cargarEdades();

    }
    else{
      document.body.innerHTML = ` <p>Acceso no autorizado ❌</p> <small>Serás redirigido automáticamente…</small>
      `;
      setTimeout(() => {
        localStorage.clear(); // opcional si quieres limpiar todo
        window.location.replace(homepath);
      }, 5000); // 5 segundos para que puedas leer el mensaje
      return false;
    }
  } catch (error) {
    console.error("Error al cargar accesos", error);
  }
}

function cargarEdades() {
  if (tipoAcceso === "Libre" && window.alumnosData) {
    const contenedor = document.getElementById("edades");
    contenedor.innerHTML = ""; // limpiar antes de cargar

    // Obtener todas las edades desde la columna "codigo"
    const edades = window.alumnosData
    .map(u => parseInt(u.Codigo, 10))
    .filter(n => !isNaN(n)); // solo números válidos

    if (edades.length === 0) {
      document.getElementById("mensaje").textContent = "No se encontraron edades en los datos.";
      return;
    }

    const minEdad = Math.min(...edades);
    const maxEdad = Math.max(...edades);
    // Crear boones dinámicos desde minEdad hasta maxEdad
    for (let i = minEdad; i <= maxEdad; i++) {
      const btn = document.createElement("div");
      btn.className = "edad";
      btn.textContent = i;
      btn.addEventListener("click", () => {
        document.querySelectorAll(".edad").forEach(e => e.classList.remove("seleccionada"));
        btn.classList.add("seleccionada");
        edadSeleccionada = i;
      });
      contenedor.appendChild(btn);
    }
  }
}

function generarLlave() {
  const llave = Math.random().toString(36).substring(2, 12).toUpperCase();
  const expiracion = Date.now() + 30 * 1000; // 30 segundos
  localStorage.setItem("llaveAcceso", JSON.stringify({ llave, expiracion }));
  return llave;
}

document.getElementById("btnAcceder").addEventListener("click", () => {
  if (!nombreSeleccionado) {
    document.getElementById("mensaje").textContent = "Debes escoger tu nombre.";
    return;
  }

  if (tipoAcceso === "Libre" && !edadSeleccionada) {
    document.getElementById("mensaje").textContent = "Debes escoger tu edad.";
    return;
  }

  if (tipoAcceso === "Codigo" && !document.getElementById("inputCodigo").value) {
    document.getElementById("mensaje").textContent = "Debes ingresar tu código.";
    return;
  }

  const alumno = window.alumnosData.find(u => u.Nombre === nombreSeleccionado);
  if (!alumno) {
    document.getElementById("mensaje").textContent = "Alumno no encontrado.";
    return;
  }

  let valido = false;
  if (tipoAcceso === "Codigo") {
    const codigoIngresado = document.getElementById("inputCodigo").value.trim();
    valido = String(alumno.Codigo).trim() === codigoIngresado;
  } else if (tipoAcceso === "Libre") {
    valido = String(alumno.Codigo).trim() === String(edadSeleccionada);
  }
  if (valido) {
    if (localStorage.getItem("IDcurso")) {
      generarLlave();
      window.location.href = `${homepath}cursos/index.html`;
    }
    else {
      alert("No se encontró la ruta del curso seleccionado.");
    }
  } else {
    document.getElementById("mensaje").textContent = "Datos inválidos, intenta de nuevo.";
  }
});
const mes = new Date().getMonth();

let fondo = "";

// Invierno: diciembre (11), enero (0), febrero (1)
if (mes === 11 || mes === 0 || mes === 1) {
  fondo = "img/invierno.jpg"; // Invierno
}
// Primavera: marzo (2), abril (3), mayo (4)
else if (mes >= 2 && mes <= 4) {
  fondo = "img/primavera.jpg"; // Primavera
}
// Verano: junio (5), julio (6), agosto (7)
else if (mes >= 5 && mes <= 7) {
  fondo = "img/verano.jpg"; // Verano
}
// Otoño: septiembre (8), octubre (9), noviembre (10)
else if (mes >= 8 && mes <= 10) {
  fondo = "img/otono.jpg"; // Otoño
}
document.body.style.backgroundImage = `url('${fondo}')`;
cargarNombres();
