export function ocultarLoader() {
  gsap.to("#loader", {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      document.getElementById("loader").style.display = "none";
    }
  });
}


export function transicionEntrada(selector) {
  const elementos = document.querySelectorAll(selector);
  if (!elementos.length) return;

  gsap.from(elementos, {
    opacity: 0,
    y: 30,
    duration: 0.5,
    stagger: 0.12,
    ease: "power2.out"
  });
}

export function transicionSalida(selector, callback) {
  const elemento = document.querySelector(selector);
  if (!elemento) {
    callback?.();
    return;
  }

  gsap.to(elemento, {
    opacity: 0,
    y: -20,
    duration: 0.4,
    ease: "power2.in",
    onComplete: callback
  });
}
