// --- CONFIGURACIÓN DE RUTA ---
const homepath = (() => {
    const path = window.location.pathname;
    return path.includes('InnBot') ? '/InnBot/' : '/ZM/';
})();

// --- MOTOR DE VALIDACIÓN (El "Canario") ---
function XO1O1() {
    const rawData = localStorage.getItem("codigoSoporte");
    if (!rawData) return { valido: false, error: "No hay llave" };

    try {
        const { llave, expiracion } = JSON.parse(rawData);
        const prefijo = "_$@&";

        if (!llave.startsWith(prefijo)) return { valido: false, error: "Firma inválida" };

        // Extraer componentes por posición exacta
        const cuerpoYFirma = llave.substring(prefijo.length); 
        const cuerpoCifrado = cuerpoYFirma.substring(0, 8);
        const firmaRecibida = cuerpoYFirma.substring(8, 10);

        // Validar integridad (El Canario)
        const char1 = cuerpoCifrado.charCodeAt(0);
        const char3 = cuerpoCifrado.charCodeAt(2);
        const firmaEsperada = ((char1 + char3) % 99).toString().padStart(2, '0');

        if (firmaRecibida !== firmaEsperada) return { valido: false, error: "Integridad comprometida" };

        // Validar tiempo
        if (Date.now() > expiracion) return { valido: false, error: "Tiempo agotado" };

        // ÉXITO: Borramos solo la llave para que no se use dos veces
        localStorage.removeItem("codigoSoporte"); 
        return { valido: true };

    } catch (e) {
        return { valido: false, error: "Fallo de protocolo" };
    }
}

// --- LÓGICA DE PERSONALIZACIÓN ---
function generarNombreEmpresa(nombre) {
    if (!nombre || nombre === "CEO") return "Global Corp";
    const nombreLimpio = nombre.trim().split(" ")[0];
    const ultimaLetra = nombreLimpio.slice(-1).toLowerCase();
    
    if (ultimaLetra === 'a') return `${nombreLimpio}'Solutions`;
    if (['o', 'e'].includes(ultimaLetra)) return `Tech-${nombreLimpio}'s`;
    return `${nombreLimpio} & Ventures`;
}

function iniciarGeneral(){
    const nombre = localStorage.getItem("nombreAlumno") || "CEO";
    document.querySelectorAll(".clase-nombre-alumno").forEach(el => el.textContent = nombre);
}

function iniciarOfimatica(){
    const nombre = localStorage.getItem("nombreAlumno") || "CEO";
    const empresa = generarNombreEmpresa(nombre);
    document.querySelectorAll(".clase-nombre-alumno").forEach(el => el.textContent = empresa);
}

// --- INICIO DE LA APP ---
function iniciarApp(){
    const res = XO1O1();

    if (!res.valido){
        // Bloqueo visual
        document.body.innerHTML = `
            <div style="font-family:sans-serif; text-align:center; padding-top:50px;">
                <h2 style="color:red;">Acceso Denegado</h2>
                <p>${res.error}</p>
                <small>Redirigiendo al inicio...</small>
            </div>`;
        
        setTimeout(() => {
            localStorage.clear();
            window.location.replace(homepath);
        }, 3000);
    } else {
        // Leemos el parámetro data-v del script
        const tipoSoporte = document.currentScript.dataset.v;
        switch (tipoSoporte) {
            case 'A': iniciarGeneral(); break;
            case 'B': iniciarOfimatica(); break;
            default: console.warn("Modo no definido");
        }
    }
}
iniciarApp();