import { navigateToSection } from "../Script.js";
const homepath = "https://zonamark/ZM/";

// ---------------- Detectar cuando aparezca el formulario ----------------
const observer = new MutationObserver(() => {
  const form = document.getElementById('cotizarForm');
  if (form && !form.dataset.listenerAdded) {
    form.dataset.listenerAdded = "true";

    form.addEventListener('submit', async function(event) {
      event.preventDefault();

      let phone = document.getElementById('whatsapp').value.trim();
      if (!phone.startsWith('+52')) {
        phone = '+52' + phone;
      }

      try {
        // 1️⃣ Autenticación anónima
        await signInAnonymously(auth);
        const uid = auth.currentUser.uid; // UID único por usuario

        // 2️⃣ Datos del formulario
        const datos = {
          nombre: document.getElementById('nombre').value,
          whatsapp: phone,
          correo: document.getElementById('correo').value,
          ciudad: document.getElementById('ciudad').value,
          servicio: document.getElementById('curso').value,
          fecha: new Date().toLocaleString()
        };

        // 3️⃣ Guardar en la BD bajo el UID
        await set(ref(db, 'Servicios/' + uid), datos);

        // 4️⃣ Feedback al usuario
        showToast("En breve nos comunicaremos contigo ✔");
        localStorage.removeItem("cotizar");
        navigateToSection("Servicios");

      } catch (error) {
        console.error("ERROR:", error);
        showToast("Lo lamento ha ocurrido un ERROR");
      }
    });

    observer.disconnect();
  }
});

observer.observe(document.body, { childList: true, subtree: true });
