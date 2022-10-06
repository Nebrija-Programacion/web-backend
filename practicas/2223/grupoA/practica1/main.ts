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

export const convert = (obj: JSONObject): { [key: string]: string } => {
  return Object.keys(obj).reduce((acc: { [key: string]: string }, key) => {
    if (typeof obj[key] === "string") {
      acc[key] = obj[key] as string;
    } else {
      const nested = convert(obj[key] as JSONObject);
      Object.keys(nested).forEach((nestedKey) => {
        acc[`${key}.${nestedKey}`] = nested[nestedKey];
      });
    }
    return acc;
  }, {});
};

console.log(convert(obj));
