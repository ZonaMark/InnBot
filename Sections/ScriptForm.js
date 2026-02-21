/*  ================================= Script Form Dinámico =========================*/
// ---------- Firebase ----------
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getDatabase, ref, set, get, push } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";
import { navigateToSection } from "../Script.js";
import { renderCarrito, esperarProductos } from "./Cargar_cart.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-functions.js";

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
const functions = getFunctions(app, "us-central1");
const generarCodigoFn = httpsCallable(functions, "generarCodigo");
const validarCodigoFn = httpsCallable(functions, "validarCodigo");


const homepath = "https://zonamark/ZM/";


export async function validarCodigo(passValue) {
  try {
    const result = await validarCodigoFn({ codigo: passValue });
    return result.data;
  } catch (error) {
    return { valido: false, mensaje: " ❌ Error de servidor" };
  }
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


window.finalizarVenta = async function () {
  try {
    if (!nombre.value || !telefono.value || Object.keys(carrito).length === 0) {
      throw new Error("Completa los datos y agrega productos");
    }

    await signInAnonymously(auth);
    if (!auth.currentUser) {
      throw new Error("No se pudo autenticar al usuario");
    }
    const uid = auth.currentUser.uid;
    const venta = {
    cliente: nombre.value,
     fecha: new Date().toLocaleString(),
     telefono: telefono.value,
     total: totalSpan.textContent,
     Productos: {}
    };
    // Reorganiza el carrito 
    Object.entries(carrito).forEach(([key, item], index) => {
      venta.Productos[index] = {
        Descripción: item.producto.Descripción,
        Cantidad: item.cantidad,
        Precio_Promedio: item.producto["Precio Promedio"],
        Con_Iva: item.producto["Con Iva"]
      };
    });
    const ventasRef = ref(db, "Ventas/" + uid);
    const result = await push(ventasRef, venta);
    showToast("En breve nos ponemos en contacto para la venta directa ✔");
    carrito = {};
    renderCarrito();
    nombre.value = ""; 
    telefono.value = "";
    navigateToSection("Catalogo");
    esperarProductos();
  } catch (error) {
    console.error("❌ Error en finalizarVenta:", error);
    showToast("Error al registrar la venta: " + error.message);
  }
};

observer.observe(document.body, { childList: true, subtree: true });

// ---------------- reCAPTCHA Listener (opcional) ----------------


document.body.addEventListener("click", async (e) => {
  if (e.target && e.target.id === "submitBtn") {

    const pass = document.getElementById("passwordInput").value;

    try {
      const result = await generarCodigoFn({ password: pass });

      const box = document.getElementById("overcode");
      box.textContent = `Código generado: ${result.data.codigo}`;

      setTimeout(() => {
        box.textContent = "";
        document.getElementById("overcode").remove();
        document.getElementById("G91364").style.display = "none";
      }, 15000);

    } catch (error) {
      alert("Contraseña incorrecta ❌");
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
