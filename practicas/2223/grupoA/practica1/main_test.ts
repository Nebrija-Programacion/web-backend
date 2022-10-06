import { assertEquals } from "https://deno.land/std@0.158.0/testing/asserts.ts";
import { convert } from "./main.ts";

Deno.test(function convertTest() {
  type JSONObject = {
    [key: string]: string | JSONObject;
  };

  const obj: JSONObject = {
    "cookies-modal": {
      refuse: "Rechazar",
      title: "Aviso de Cookies",
      text: "Este sitio web utiliza cookies propias y de terceros",
    },
    "forgot-password": {
      "send-button": "Enviar",
      email: {
        label: "Correo electrónico",
        placeholder: "Correo electrónico",
        error:
          "No existe una cuenta de usuario asociada a este correo electrónico",
      },
      "sent-modal": {
        "send-again-button": "Volver a enviar email",
        text: "Revisa la bandeja de tu correo electrónico, si no se encuentra ahí, es posible que esté en la carpeta de Spam.",
        title: "Email enviado",
      },
      text: "Escribe tu correo electrónico y te enviaremos un email con un enlace para que puedas crear una nueva contraseña.",
      title: "Contraseña olvidada",
    },
  };

  const produced = convert(obj);

  const expected: { [key: string]: string } = {
    "cookies-modal.refuse": "Rechazar",
    "cookies-modal.title": "Aviso de Cookies",
    "cookies-modal.text":
      "Este sitio web utiliza cookies propias y de terceros",
    "forgot-password.send-button": "Enviar",
    "forgot-password.email.label": "Correo electrónico",
    "forgot-password.email.placeholder": "Correo electrónico",
    "forgot-password.email.error":
      "No existe una cuenta de usuario asociada a este correo electrónico",
    "forgot-password.sent-modal.send-again-button": "Volver a enviar email",
    "forgot-password.sent-modal.text":
      "Revisa la bandeja de tu correo electrónico, si no se encuentra ahí, es posible que esté en la carpeta de Spam.",
    "forgot-password.sent-modal.title": "Email enviado",
    "forgot-password.text":
      "Escribe tu correo electrónico y te enviaremos un email con un enlace para que puedas crear una nueva contraseña.",
    "forgot-password.title": "Contraseña olvidada",
  };

  assertEquals(produced, expected);
});
