const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");
const twilio = require("twilio");
const {defineSecret} = require("firebase-functions/params");
const {onValueCreated} = require("firebase-functions/v2/database");

admin.initializeApp();

// --- Secrets ---
const SENDGRID_API_KEY = defineSecret("SENDGRID_API_KEY");
const TWILIO_ACCOUNT_SID = defineSecret("TWILIO_ACCOUNT_SID");
const TWILIO_AUTH_TOKEN = defineSecret("TWILIO_AUTH_TOKEN");
const TWILIO_WHATSAPP_NUMBER = defineSecret("TWILIO_WHATSAPP_NUMBER");

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
      sgMail.setApiKey(SENDGRID_API_KEY.value());
      const newData = event.data.val();

      // --- Correo con SendGrid ---
      const msg = {
        to: "zona.innbot@gmail.com",
        from: "zona.innbot@gmail.com",
        subject: "Nuevo contacto registrado en Firebase",
        text: `Se agregó un nuevo contacto:` +
        `\n\n${JSON.stringify(newData, null, 2)}`,
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
          to: "whatsapp:+5212711912112",
          body: `nuevo contacto:\n\n${JSON.stringify(newData, null, 2)}`});

        console.log("✅ WhatsApp enviado con éxito");
      } catch (error) {
        console.error("❌ Error enviando WhatsApp:", error);
      }
    },
);


