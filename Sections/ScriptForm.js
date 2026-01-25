/*  ================================= Script Form Dinámico =========================*/
// ---------- Firebase ----------
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

import { navigateToSection } from "../Script.js";

const homepath = "https://zonamark/ZM/";

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
const auth = getAuth(app);

export async function validarCodigo(passValue) {
try{
  const snapshot = await get(ref(db, "codigos"));
  if (!snapshot.exists()) {
    return { valido: false, mensaje: "No existe el nodo codigos ❌" };
  }
  const datos = snapshot.val();
  const ahora = Date.now();
  if (ahora > datos.expiresAt) {
    return { valido: false, mensaje: "El código ha expirado ❌" };
  }
  if (passValue !== datos.codigo) {
    return { valido: false, mensaje: "Código incorrecto ❌" };
  }
  return { valido: true, mensaje: "Código válido y vigente ✅" };
} catch (err) {
	return { valido: false, mensaje: "Algo paso lo siento." }; }
}

export async function obtenerUrl(urlvalor) {
try{
	if (urlvalor) {
		const snapshot = await get(ref(db, urlvalor));
		return snapshot.val();
	}
	else{
		window.location.href = homepath;
		return null
	}
} catch (err){
	window.location.href = homepath;
	return null;
}
}

// ---------------- Detectar cuando aparezca el formulario ----------------
const observer = new MutationObserver(() => {
  const formContac = document.getElementById('contactForm');
  const formServ = document.getElementById('cotizarForm');
  if (formContac && !formContac.dataset.listenerAdded) {
    formContac.dataset.listenerAdded = "true";
    formContac.addEventListener('submit', async function(event) {
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
          curso: document.getElementById('curso').value,
          fecha: new Date().toLocaleString()
        };

        // 3️⃣ Guardar en la BD bajo el UID
        await set(ref(db, 'Contactos/' + uid), datos);

        // 4️⃣ Feedback al usuario
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
    if (formServ && !formServ.dataset.listenerAdded) {
      formServ.dataset.listenerAdded = "true";
      formServ.addEventListener('submit', async function(event) {
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
            servicio: document.getElementById('servicio').value,
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

// ---------------- reCAPTCHA Listener (opcional) ----------------

function generarCodigo() {
  const codigo = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 30 * 60 * 1000; // 30 minutos
  const createdAt = Date.now();
  // Guardar en Firebase bajo codigos/{codigo}
  set(ref(db, "codigos/"), {
    codigo,
    expiresAt,
    createdAt
  });
  const box = document.getElementById("overcode");
  box.textContent = `Código generado: ${codigo}`;
  setTimeout(() => {
	box.textContent = "";                       // borra el texto
	document.getElementById("overcode").remove(); // quita el overlay
	document.getElementById("G91364").style.display = "none"; // oculta el otro elemento
	}, 15000); // espera 15 segundos
}

document.body.addEventListener("click", async (e) => {
  if (e.target && e.target.id === "submitBtn") {
    const pass = document.getElementById("passwordInput").value;
    const snapshot = await get(ref(db, "Acceso/Codigo"));
    if (snapshot.exists()) {
      const claveGuardada = snapshot.val();
      if (pass === claveGuardada) {
        generarCodigo();
      } else {
        alert("Contraseña incorrecta ❌");
      }
    }
  }
});

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
