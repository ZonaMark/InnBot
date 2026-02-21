const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");
const twilio = require("twilio");
const {defineSecret} = require("firebase-functions/params");
const {onValueCreated} = require("firebase-functions/v2/database");
const {onCall} = require("firebase-functions/v2/https");

admin.initializeApp();

// --- Secrets ---
const SENDGRID_API_KEY = defineSecret("SENDGRID_API_KEY");
const TWILIO_ACCOUNT_SID = defineSecret("TWILIO_ACCOUNT_SID");
const TWILIO_AUTH_TOKEN = defineSecret("TWILIO_AUTH_TOKEN");
const TWILIO_WHATSAPP_NUMBER = defineSecret("TWILIO_WHATSAPP_NUMBER");
const CLAVE_ADMIN = defineSecret("CLAVE_ADMIN");

// --- Función para Contactos ---
exports.sendEmailOnNewContact = onValueCreated(
    {
      ref: "/Contactos/{pushId}",
      secrets: [
        SENDGRID_API_KEY,
        TWILIO_ACCOUNT_SID,
        TWILIO_AUTH_TOKEN,
        TWILIO_WHATSAPP_NUMBER,
      ],
    },
    async (event) => {
      await handleNotification(event, "Nuevo contacto registrado en Firebase");
    },
);
// --- Función para Servicios ---
exports.sendEmailOnNewService = onValueCreated(
    {
      ref: "/Servicios/{pushId}",
      secrets: [
        SENDGRID_API_KEY,
        TWILIO_ACCOUNT_SID,
        TWILIO_AUTH_TOKEN,
        TWILIO_WHATSAPP_NUMBER,
      ],
    },
    async (event) => {
      await handleNotification(event, "Nuevo servicio registrado en Firebase");
    },
);
// --- Funcion para Ventas ---
exports.sendEmailOnNewSale = onValueCreated(
    {
      ref: "/Ventas/{uid}/{ventaId}",
      secrets: [SENDGRID_API_KEY,
        TWILIO_ACCOUNT_SID,
        TWILIO_AUTH_TOKEN,
        TWILIO_WHATSAPP_NUMBER,
      ],
    },
    async (event) => {
      await handleNotification(event, "Nueva venta registrada en Firebase");
    },
);
/**
 * Envía notificación por correo y WhatsApp cuando se crea un nuevo registro.
 * @param {Object} event - Evento de Firebase con los datos nuevos.
 * @param {string} subject - Asunto del correo.
 */
async function handleNotification(event, subject) {
  sgMail.setApiKey(SENDGRID_API_KEY.value());
  const newData = event.data.val();

  // --- Correo con SendGrid ---
  const msg = {
    to: "zona.innbot@gmail.com", // tu correo destino
    from: "zona.innbot@gmail.com", // remitente autorizado en SendGrid
    subject,
    text: `Se agregó un nuevo registro:\n\n${JSON.stringify(newData, null, 2)}`,
  };
  try {
    await sgMail.send(msg);
    console.log("✅ Correo enviado con éxito");
  } catch (error) {
    console.error("❌ Error enviando correo:", error);
  }
  // --- WhatsApp con Twilio ---
  const client = twilio(
      TWILIO_ACCOUNT_SID.value(),
      TWILIO_AUTH_TOKEN.value(),
  );
  try {
    await client.messages.create({
      from: `whatsapp:${TWILIO_WHATSAPP_NUMBER.value()}`,
      to: "whatsapp:+5212711912112", // tu número personal
      body: `Nuevo registro:\n\n${JSON.stringify(newData, null, 2)}`,
    });
    console.log("✅ WhatsApp enviado con éxito");
  } catch (error) {
    console.error("❌ Error enviando WhatsApp:", error);
  }
}

exports.generarCodigo = onCall(
    {secrets: [CLAVE_ADMIN]},
    async (request) => {
      const {password} = request.data;

      if (!password || password !== CLAVE_ADMIN.value()) {
        throw new Error("No autorizado");
      }

      const codigo = Math.random().toString(36).substring(2, 8).toUpperCase();
      const ahora = Date.now();
      const expira = ahora + 4 * 60 * 60 * 1000; // 4 horas

      await admin.database().ref("codigos").set({
        codigo,
        expira,
        creado: ahora,
        activo: true,
      });

      return {codigo, expira};
    },
);


exports.validarCodigo = onCall(
    {region: "us-central1"},
    async (request) => {
      const passValue = request.data.codigo;

      if (!passValue) {
        return {valido: false, mensaje: "❌ Codigo Proporcionado x Facilitador"};
      }

      const snapshot = await admin.database()
          .ref("codigos")
          .once("value");

      if (!snapshot.exists()) {
        return {valido: false, mensaje: "No existe el nodo CODIGOS❌"};
      }

      const datos = snapshot.val();
      const ahora = Date.now();

      // 🔒 Verificar si está activo
      if (!datos.activo) {
        return {valido: false, mensaje: "El acceso no está habilitado ❌"};
      }

      // ⏳ Verificar expiración
      if (ahora > datos.expira) {
        await admin.database().ref("codigos/activo").set(false);
        return {valido: false, mensaje: "El código ha expirado ⏳"};
      }

      // 🔑 Verificar coincidencia
      if (passValue !== datos.codigo) {
        return {valido: false, mensaje: "Código incorrecto ❌"};
      }

      return {valido: true, mensaje: "Código válido y vigente ✅"};
    },
);
