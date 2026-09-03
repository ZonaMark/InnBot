// SDK administrativo de Firebase.
const admin = require("firebase-admin");

// Envio de correos por SMTP.
const nodemailer = require("nodemailer");

// Peticiones HTTP para Telegram.
const axios = require("axios");

// Lectura segura de secretos de Firebase.
const {defineSecret} = require("firebase-functions/params");

// Eventos de creacion en Realtime Database.
const {onValueCreated} = require("firebase-functions/v2/database");

// Funciones invocables por HTTPS.
const {onCall} = require("firebase-functions/v2/https");

// Inicializa Firebase Admin.
admin.initializeApp();

// --- Definición de Secretos de Seguridad en Firebase ---

// Define el secreto donde se almacena tu cuenta de correo de Gmail.
const GMAIL_EMAIL = defineSecret("GMAIL_EMAIL");

// Define la contraseña de aplicacion de Gmail.
const GMAIL_APP_PASSWORD = defineSecret("GMAIL_APP_PASSWORD");

// Define el token del bot de Telegram.
const TELEGRAM_BOT_TOKEN = defineSecret("TELEGRAM_BOT_TOKEN");

// Define el chat destino de Telegram.
const TELEGRAM_CHAT_ID = defineSecret("TELEGRAM_CHAT_ID");

// Define el secreto que almacena la clave administrativa del sistema.
const CLAVE_ADMIN = defineSecret("CLAVE_ADMIN");


// --- Funciones Disparadoras por Eventos de Base de Datos ---

// Escucha la creación de un nuevo nodo dentro de la ruta /Contactos/{pushId}.
exports.sendEmailOnNewContact = onValueCreated(
    {
      // Ruta a monitorear.
      ref: "/Contactos/{pushId}",
      // Secretos disponibles durante la ejecucion.
      secrets: [
        GMAIL_EMAIL,
        GMAIL_APP_PASSWORD,
        TELEGRAM_BOT_TOKEN,
        TELEGRAM_CHAT_ID,
      ],
    },
    // Evento ejecutado al crear un contacto.
    async (event) => {
      // Envia la notificacion del contacto.
      await handleNotification(event, "Nuevo contacto registrado en Firebase");
    },
);

// Escucha la creación de un nuevo nodo dentro de la ruta /Servicios/{pushId}.
exports.sendEmailOnNewService = onValueCreated(
    {
      // Ruta a monitorear.
      ref: "/Servicios/{pushId}",
      // Secretos para notificaciones.
      secrets: [
        GMAIL_EMAIL,
        GMAIL_APP_PASSWORD,
        TELEGRAM_BOT_TOKEN,
        TELEGRAM_CHAT_ID,
      ],
    },
    // Evento ejecutado al crear un servicio.
    async (event) => {
      // Llama a la función de notificación para servicios.
      await handleNotification(event, "Nuevo servicio registrado en Firebase");
    },
);

// Escucha nuevos registros en /Ventas/{uid}/{ventaId}.
exports.sendEmailOnNewSale = onValueCreated(
    {
      // Especifica la ruta dinámica para registrar ventas por usuario.
      ref: "/Ventas/{uid}/{ventaId}",
      // Inyecta los secretos de Gmail y Telegram.
      secrets: [
        GMAIL_EMAIL,
        GMAIL_APP_PASSWORD,
        TELEGRAM_BOT_TOKEN,
        TELEGRAM_CHAT_ID,
      ],
    },
    // Función asíncrona ejecutada cuando se genera una nueva venta.
    async (event) => {
      // Llama a la función de notificación para ventas.
      await handleNotification(event, "Nueva venta registrada en Firebase");
    },
);


/**
 * Maneja notificaciones por correo Gmail y Telegram.
 * @param {Object} event - Evento de Firebase con la información capturada.
 * @param {string} subject - Título descriptivo del evento registrado.
 */
async function handleNotification(event, subject) {
  // Extrae los datos reales guardados en el nuevo nodo registrado.
  const newData = event.data.val();

  // Convierte el objeto recibido en texto legible.
  const textoFormateado = JSON.stringify(newData, null, 2);

  // --- 1. PROCESO DE ENVÍO DE CORREO ELECTRÓNICO (GMAIL VIA NODEMAILER) ---
  try {
    // Configura el transporte SMTP de Gmail.
    const transporter = nodemailer.createTransport({
      service: "gmail", // Define Gmail como proveedor de correo.
      auth: {
        user: GMAIL_EMAIL.value(),
        pass: GMAIL_APP_PASSWORD.value(),
      },
    });

    // Define la estructura del mensaje de correo electrónico a enviar.
    const mailOptions = {
      from: `"Centro Tecnológico" <${GMAIL_EMAIL.value()}>`,
      to: GMAIL_EMAIL.value(),
      subject: subject,
      text: `Se agregó un nuevo registro:\n\n${textoFormateado}`,
      html: [
        `<h2>🚨 ${subject}</h2>`,
        "<p>Se ha recibido una nueva interacción desde la plataforma:</p>",
        "<pre style=\"background-color: #f4f4f4; padding: 10px; ",
        `border-radius: 5px;">${textoFormateado}</pre>`,
      ].join(""),
    };

    // Ejecuta la instrucción de envío del correo de forma asíncrona.
    await transporter.sendMail(mailOptions);
    // Imprime una confirmación en la consola de Firebase al enviarse con éxito.
    console.log("✅ Correo enviado con éxito mediante Gmail");
  } catch (error) {
    // Registra errores de envio de correo.
    console.error("❌ Error enviando correo:", error);
  }


  // --- 2. PROCESO DE ENVÍO DE NOTIFICACIÓN A TELEGRAM ---
  try {
    // Construye la URL oficial de la API de Telegram con el Token de tu Bot.
    const urlTelegram = [
      "https://api.telegram.org/bot",
      TELEGRAM_BOT_TOKEN.value(),
      "/sendMessage",
    ].join("");

    // Diseña el mensaje que llegará al chat de Telegram con formato Markdown.
    const mensajeTelegram = [
      `🚨 *${subject.toUpperCase()}*`,
      "",
      "```json",
      textoFormateado,
      "```",
    ].join("\n");

    // Envia el mensaje a Telegram.
    await axios.post(urlTelegram, {
      chat_id: TELEGRAM_CHAT_ID.value(), // ID numérico de tu chat o canal.
      text: mensajeTelegram, // Texto del mensaje.
      parse_mode: "Markdown",
    });

    // Confirma en consola la notificacion.
    console.log("✅ Notificación enviada con éxito a Telegram");
  } catch (error) {
    // Registra fallos de Telegram.
    console.error("❌ Error enviando notificación a Telegram:", error);
  }
}


// --- Funciones Administrativas y Gestión de Códgos ---

// Función invocable para generar un código temporal de acceso.
exports.generarCodigo = onCall(
    {secrets: [CLAVE_ADMIN]}, // Inyecta la clave secreta de administrador.
    async (request) => {
      // Extrae la contraseña proporcionada desde los datos de la llamada.
      const {password} = request.data;

      // Valida si la contraseña coincide con Secrets.
      if (!password || password !== CLAVE_ADMIN.value()) {
        // Lanza un error y detiene la ejecución si no está autorizado.
        throw new Error("No autorizado");
      }

      // Genera una cadena aleatoria de 6 caracteres.
      const codigo = Math.random().toString(36).substring(2, 8).toUpperCase();
      // Captura la marca de tiempo actual en milisegundos.
      const ahora = Date.now();
      // Define la expiracion de 4 horas.
      const expira = ahora + 4 * 60 * 60 * 1000;

      // Guarda el codigo en Realtime Database.
      await admin.database().ref("codigos").set({
        codigo,
        expira,
        creado: ahora,
        activo: true,
      });

      // Retorna el codigo y su expiracion.
      return {codigo, expira};
    },
);


// Funcion invocable para validar si un codigo esta vigente y activo.
exports.validarCodigo = onCall(
    {region: "us-central1"}, // Define la región de ejecución del servidor.
    async (request) => {
      // Obtiene el valor del código recibido en la petición.
      const passValue = request.data.codigo;

      // Si no se envió ningún código, regresa respuesta de rechazo inmediata.
      if (!passValue) {
        return {valido: false, mensaje: "❌ Codigo Proporcionado x Facilitador"};
      }

      // Lee una vez el nodo de codigos.
      const snapshot = await admin.database()
          .ref("codigos")
          .once("value");

      // Verifica si el nodo contiene datos o no existe.
      if (!snapshot.exists()) {
        return {valido: false, mensaje: "No existe el nodo CODIGOS❌"};
      }

      // Extrae los datos leídos del nodo.
      const datos = snapshot.val();
      // Captura la fecha/hora actual.
      const ahora = Date.now();

      // Verifica si la bandera del código marca 'falso' (inactivo).
      if (!datos.activo) {
        return {valido: false, mensaje: "El acceso no está habilitado ❌"};
      }

      // Compara el tiempo actual contra el tiempo límite de expiración.
      if (ahora > datos.expira) {
        // Desactiva el código expirado en la base de datos.
        await admin.database().ref("codigos/activo").set(false);
        return {valido: false, mensaje: "El código ha expirado ⏳"};
      }

      // Compara el código ingresado contra el almacenado.
      if (passValue !== datos.codigo) {
        return {valido: false, mensaje: "Código incorrecto ❌"};
      }

      // Si pasa todas las validaciones anteriores, aprueba el acceso.
      return {valido: true, mensaje: "Código válido y vigente ✅"};
    },
);


/**
 * Valida la contraseña de administrador recibida.
 * @param {string} password Contraseña recibida desde el cliente.
 */
function validarPasswordAdmin(password) {
  // Verifica si no se recibió contraseña o si no coincide con la clave secreta.
  if (!password || password !== CLAVE_ADMIN.value()) {
    // Interrumpe la ejecución con un mensaje de no autorizado.
    throw new Error("No autorizado");
  }
}


/**
 * Verifica la estructura valida del catalogo de cursos.
 * @param {Object} catalogo Estructura recibida del catálogo.
 */
function validarCatalogoCursos(catalogo) {
  // Confirma que el objeto 'catalogo' exista y sea de tipo objeto.
  if (!catalogo || typeof catalogo !== "object") {
    throw new Error("Catalogo invalido");
  }

  // Verifica que exista el objeto interno 'contacto'.
  if (!catalogo.contacto || typeof catalogo.contacto !== "object") {
    throw new Error("Falta la seccion contacto");
  }

  // Comprueba que 'cursos' sea un arreglo / lista válida.
  if (!Array.isArray(catalogo.cursos)) {
    throw new Error("La seccion cursos debe ser una lista");
  }

  // Recorre los cursos y evalua sus campos basicos.
  catalogo.cursos.forEach((curso, index) => {
    // Si la entrada no es un objeto válido, falla.
    if (!curso || typeof curso !== "object") {
      throw new Error(`Curso invalido en posicion ${index + 1}`);
    }

    // Verifica que cada curso contenga obligatoriamente título e ID.
    if (!curso.titulo || !curso.ID) {
      throw new Error(`El curso ${index + 1} necesita titulo e ID`);
    }
  });
}


// Función invocable para validar el acceso administrativo.
exports.validarAdmin = onCall(
    {secrets: [CLAVE_ADMIN]}, // Asigna la clave administrativa desde Secrets.
    async (request) => {
      // Valida la clave recibida mediante la función auxiliar.
      validarPasswordAdmin(request.data.password);
      // Retorna estatus autorizado si la contraseña fue correcta.
      return {valido: true, mensaje: "Admin autorizado"};
    },
);


// Funcion invocable para obtener el catalogo con autenticacion admin.
exports.obtenerCatalogoCursosAdmin = onCall(
    {secrets: [CLAVE_ADMIN]},
    async (request) => {
      // Válida los permisos del administrador.
      validarPasswordAdmin(request.data.password);

      // Consulta la base de datos en la ruta del catálogo de cursos.
      const snapshot = await admin.database()
          .ref("catalogoCursos")
          .once("value");

      // Regresa el estatus de existencia y la información leída.
      return {
        existe: snapshot.exists(),
        catalogo: snapshot.exists() ? snapshot.val() : null,
      };
    },
);


// Función invocable pública para consultar el catálogo de cursos.
exports.obtenerCatalogoCursos = onCall(
    {region: "us-central1"},
    async () => {
      // Consulta en modo lectura el nodo del catálogo de cursos.
      const snapshot = await admin.database()
          .ref("catalogoCursos")
          .once("value");

      // Regresa la respuesta estructurada a la aplicación frontend.
      return {
        existe: snapshot.exists(),
        catalogo: snapshot.exists() ? snapshot.val() : null,
      };
    },
);


// Funcion invocable para guardar o actualizar el catalogo de cursos.
exports.guardarCatalogoCursosAdmin = onCall(
    {secrets: [CLAVE_ADMIN]},
    async (request) => {
      // Obtiene la contraseña y el catalogo recibidos.
      const {password, catalogo} = request.data;

      // Valida la contraseña recibida.
      validarPasswordAdmin(password);
      // Valida la estructura requerida del catálogo.
      validarCatalogoCursos(catalogo);

      // Guarda el catalogo y agrega fecha de actualizacion.
      await admin.database().ref("catalogoCursos").set({
        ...catalogo,
        actualizado: Date.now(),
      });

      // Devuelve la confirmación del guardado con el conteo total de cursos.
      return {
        guardado: true,
        totalCursos: catalogo.cursos.length,
      };
    },
);
