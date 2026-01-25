
  document.addEventListener("DOMContentLoaded", () => {
  const hotsaleContainer = document.getElementById("hotsale-container");

  // Revisar el JSON
  fetch("Sections/hotsale.json")
    .then(res => res.json())
    .then(data => {
      if (data.hotsale && data.hotsale.venta === true) {
        // Mostrar el contenedor
        hotsaleContainer.style.display = "block";

        // Cargar el HTML del widget
        fetch("Sections/hotsale.html")
          .then(res => res.text())
          .then(html => {
            hotsaleContainer.innerHTML = html;

            const saletoggleBtn = document.getElementById("hotsaleToggle");
            const salepanel = document.getElementById("hotsalePanel");

            saletoggleBtn.addEventListener("click", () => {
              salepanel.classList.add("open");

              // Aquí cargas los servicios del JSON como ya lo hicimos antes
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

              // Botones de acción
              const actions = document.createElement("div");
              actions.classList.add("hotsale-actions");
              actions.innerHTML = `
                <button class="contact-btn">Ponerme en contacto</button>
                <button class="cancel-btn">Cancelar</button>
              `;
              salepanel.appendChild(actions);

              actions.querySelector(".cancel-btn").addEventListener("click", () => {
                salepanel.classList.remove("open");
              });
              actions.querySelector(".contact-btn").addEventListener("click", () => {
              const whatsappNumber = localStorage.getItem("whatsapp"); // tu número guardado
              if (whatsappNumber) {
              // Abrir WhatsApp con mensaje prellenado
               const mensaje = encodeURIComponent("Hola, estoy interesado en la oferta del hotsale.");
               window.open(`https://wa.me/${whatsappNumber}?text=${mensaje}`, "_blank");
              } else {
               alert("No se encontró un número de WhatsApp en localStorage.");
              }
              });
            });
          });
      } else {
        // Ocultar el contenedor si venta es false
        hotsaleContainer.style.display = "none";
      }
    })
    .catch(err => console.error("Error cargando hotsale.json:", err));
});
