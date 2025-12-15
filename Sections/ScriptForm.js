/*  ================================= Script Form Dinámico =========================*/
// ---------- Firebase ----------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyA4rztw2QNuhy1FV9qoozCZkwOfz3jyLvk",
    authDomain: "zonamark-585d0.firebaseapp.com",
    projectId: "zonamark-585d0",
    storageBucket: "zonamark-585d0.appspot.com",
    messagingSenderId: "706009012982",
    appId: "1:706009012982:web:ec38aeee29e73426602ad7"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ---------------- Detectar cuando aparezca el formulario ----------------
const observer = new MutationObserver(() => {

    const form = document.getElementById('contactForm');
    if (form && !form.dataset.listenerAdded) {
        // Marcar que ya tiene el listener (evita múltiple ejecución)

        form.dataset.listenerAdded = "true";

        form.addEventListener('submit', async function(event) {
            event.preventDefault();

            const userId = Date.now();
			let phone = document.getElementById('whatsapp').value.trim();
			if (!phone.startsWith('+52')) {
				phone = '+52' + phone;
			}
            const datos = {
                userId: userId,
                nombre: document.getElementById('nombre').value,
                whatsapp: phone,
                correo: document.getElementById('correo').value,
                ciudad: document.getElementById('ciudad').value,
                curso: document.getElementById('curso').value,
                fecha: new Date().toLocaleString()
            };

            try {
                // 1️⃣ Guardar en la BD
                await set(ref(db, 'Contactos/' + userId), datos);

                // 2️⃣ Enviar correo con Cloud Function

                showToast("En breve nos comunicaremos contigo ✔");
                localStorage.removeItem("cursoSeleccionado");
                navigateToSection("Cursos");

            } catch (error) {
                console.error("ERROR:", error);
                showToast("Lo lamento ha ocurrido un ERROR");
            }
        });

        observer.disconnect();
    }
});

observer.observe(document.body, { childList: true, subtree: true });

// ---------------- reCAPTCHA Listener (opcional) ----------------
function onClick(e) {
    e.preventDefault();
    grecaptcha.ready(function() {
        grecaptcha.execute('6LcF900qAAAAAH1IKHVh2hz0j5COXXEMreDE84_o', {action: 'submit'}).then(function(token) {
            alert("ReCAPTCHA ejecutado");
        });
    });
}

export function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.innerText = msg;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}
