document.addEventListener("DOMContentLoaded", () => {
  const hotsaleContainer = document.getElementById("hotsale-container");
  const overlay = document.getElementById("overlay"); // reusamos el overlay

  fetch("Sections/hotsale.json")
    .then(res => res.json())
    .then(data => {
      if (data.hotsale && data.hotsale.venta === true) {
        hotsaleContainer.style.display = "block";

        fetch("Sections/hotsale.html")
          .then(res => res.text())
          .then(html => {
            hotsaleContainer.innerHTML = html;

            const saletoggleBtn = document.getElementById("hotsaleToggle");
            const salepanel = document.getElementById("hotsalePanel");

            saletoggleBtn.addEventListener("click", (e) => {
              e.stopPropagation();
              salepanel.classList.add("open");
              overlay.style.display = "block"; // mostrar overlay

              // Limpiar y cargar servicios
              salepanel.innerHTML = "";
              data.servicios.forEach(servicio => {
                const item = document.createElement("div");
                item.classList.add("hotsale-item");
                item.innerHTML = `
                  <h2>${servicio.titulo} : ${servicio.frase}</h2>
                  <div class="hotsale-images">
                    <img src="${servicio.imagen1}" alt="${servicio.titulo}">
                    <img src="${servicio.imagen2}" alt="${servicio.titulo}">
                    <img src="${servicio.imagen3}" alt="${servicio.titulo}">
                    <img src="${servicio.imagen4}" alt="${servicio.titulo}">
                  </div>
                  <p>${servicio.recurso}</p>
                  <p>${servicio.beneficios}</p>
                  <p>${servicio.sistema}</p>
                  <p>${servicio.detalles}</p>
                  <p><del>${servicio.costo}</del> <strong>${servicio.oferta}</strong> (${servicio.descuento} OFF)</p>
                `;
                salepanel.appendChild(item);
              });

              // Botón de contacto
              const contactBtn = document.createElement("button");
              contactBtn.classList.add("contact-btn");
              contactBtn.textContent = "Ponerme en contacto";
              salepanel.appendChild(contactBtn);

              contactBtn.addEventListener("click", () => {
                const whatsappNumber = localStorage.getItem("whatsapp");
                if (whatsappNumber) {
                  const mensaje = encodeURIComponent("Hola, estoy interesado en la oferta del hotsale.");
                  window.open(`https://wa.me/${whatsappNumber}?text=${mensaje}`, "_blank");
                } else {
                  alert("No se encontró un número de WhatsApp en localStorage.");
                }
              });

              // Cerrar panel al hacer click fuera (overlay)
              overlay.addEventListener("click", () => {
                salepanel.classList.remove("open");
                overlay.style.display = "none"; // ocultar overlay
              }, { once: true }); // listener se elimina automáticamente después de ejecutar
            });
          });
      } else {
        hotsaleContainer.style.display = "none";
      }
    })
    .catch(err => console.error("Error cargando hotsale.json:", err));
});