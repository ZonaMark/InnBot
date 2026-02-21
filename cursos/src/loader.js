// loader.js

export function mostrarLoader(duracion = 3, color = "#1e90ff") {
  // Creamos el contenedor del loader
  const loader = document.createElement("div");
  loader.classList.add("loader");
  loader.style.cssText = `
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #0b1220;
    z-index: 9999;
    color: #e5e7eb;
    font-family: system-ui;
    text-align: center;
  `;
  
  // Contenedor del reloj
  const relojContainer = document.createElement("div");
  relojContainer.classList.add("reloj-container");
  relojContainer.style.cssText = `
    position: relative;
    width: 120px;
    height: 120px;
    margin-bottom: 20px;
  `;
  
  // SVG circulo
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "120");
  svg.setAttribute("height", "120");
  
  const circleBg = document.createElementNS(svgNS, "circle");
  circleBg.setAttribute("cx", "60");
  circleBg.setAttribute("cy", "60");
  circleBg.setAttribute("r", "54");
  circleBg.setAttribute("stroke", "#333");
  circleBg.setAttribute("stroke-width", "12");
  circleBg.setAttribute("fill", "none");
  
  const circleProgress = document.createElementNS(svgNS, "circle");
  circleProgress.setAttribute("cx", "60");
  circleProgress.setAttribute("cy", "60");
  circleProgress.setAttribute("r", "54");
  circleProgress.setAttribute("stroke", color);
  circleProgress.setAttribute("stroke-width", "12");
  circleProgress.setAttribute("fill", "none");
  circleProgress.setAttribute("stroke-dasharray", `${2 * Math.PI * 54}`);
  circleProgress.setAttribute("stroke-dashoffset", `${2 * Math.PI * 54}`);
  circleProgress.style.transform = "rotate(-90deg)";
  circleProgress.style.transformOrigin = "50% 50%";
  
  svg.appendChild(circleBg);
  svg.appendChild(circleProgress);
  relojContainer.appendChild(svg);
  
  // Mensaje
  const mensaje = document.createElement("p");
  mensaje.textContent = "Cargando curso";
  mensaje.style.margin = "0";
  mensaje.style.fontSize = "18px";
  
  loader.appendChild(relojContainer);
  loader.appendChild(mensaje);
  document.body.appendChild(loader);

  // Timeline de GSAP
  const tl = gsap.timeline({ onComplete: () => animacionCierre(loader, mensaje) });
  
  // Entrada suave del loader
  tl.from(relojContainer, { opacity: 0, scale: 0.8, duration: 0.6, ease: "power2.out" });
  
  // Barra circular regresiva
  tl.to(circleProgress, {
    strokeDashoffset: 0,
    duration: duracion,
    ease: "linear"
  }, ">0.2"); // pequeña pausa
  
  // Pulso del mensaje
  tl.to(mensaje, { opacity: 0, duration: 0.3, onComplete: () => mensaje.textContent = "Bienvenido" });
  tl.to(mensaje, { opacity: 1, scale: 1.1, duration: 0.5, ease: "power2.out" });
}

// Animación de cierre del loader
function animacionCierre(loader, mensaje) {
  const tl = gsap.timeline({
    onComplete: () => {
      loader.remove(); // eliminamos el loader
      mostrarPantallaBienvenida();
    }
  });

  tl.to(loader, { opacity: 0, scale: 0.9, duration: 0.5, ease: "power2.inOut" });
}

// Mostrar pantalla final
function mostrarPantallaBienvenida() {
  // Crear un contenedor temporal
  const pantalla = document.createElement("div");
  pantalla.id = "pantalla-bienvenida"; // le damos un ID para poder quitarlo luego
  pantalla.style.cssText = `
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0b1220;
    color: #e5e7eb;
    font-family: system-ui;
    text-align: center;
    padding: 24px;
    z-index: 1000; /* sobre todo */
  `;

  pantalla.innerHTML = `
    <div>
      <h1>¡Bienvenido!</h1>
      <p>El curso está listo para comenzar.</p>
    </div>
  `;

  // Agregar al body
  document.body.appendChild(pantalla);

  // Ejemplo con GSAP para hacer fade in y luego fade out
  gsap.fromTo(pantalla, { opacity: 0 }, { opacity: 1, duration: 0.6, onComplete: () => {
    // Esperar 2 segundos y ocultar
    setTimeout(() => {
      gsap.to(pantalla, {
        opacity: 0,
        duration: 0.6,
        onComplete: () => {
          document.getElementById("pantalla").style.display= "none";
          pantalla.remove(); // elimina el elemento del DOM
        }
      });
    }, 900);
  }});
}
