# Examen Ordinaria

**Objetivo:** Desarrollar una API en GraphQL que permita gestionar una lista de restaurantes.

**Requisitos:**

1.  **Resolvers:**

    - **addRestaurant (3 puntos)**: Esta mutación debe aceptar los siguientes parámetros:
      - Nombre del restaurante, tipo: `String` (por ejemplo, "Restaurante El Buen Sabor")
      - Dirección del restaurante, tipo: `String` (por ejemplo, "Calle Mayor, 123")
      - Ciudad en la que se encuentra el restaurante, tipo: `String` (por ejemplo, "Madrid").
      - Número de teléfono incluyendo prefijo nacional, tipo: `String` (por ejemplo, "+34911223344") - Se debe verificar que el número de teléfono es válido.
    - **getRestaurant (3 puntos)**: Esta consulta debe aceptar el parámetro `id` generado por MongoDB y devolver:
      - `id`: ID del restaurante generado por MongoDB
      - Nombre del restaurante
      - Dirección del restaurante. Será un `String` compuesto por la dirección, la ciudad y el país. (Por ejemplo "Calle Mayor, 123, Madrid, España")
      - Número de teléfono
      - Temperatura actual en la ciudad del restaurante. (obtenido a través de la API de Clima de API Ninjas)
      - Hora local en la ubicación del restaurante (obtenida a través de la API de Zona Horaria de API Ninjas) en un `String` con formato _hh:mm_
    - **getRestaurants (2 puntos)**: Recibe como parámetro el nombre de la ciudad. Debe devolver todos los restaurantes almacenados que se encuentren en dicha ciudad, con los mismos campos mencionados anteriormente.
    - **deleteRestaurant (2 puntos)**: Esta mutación debe aceptar el parámetro `id` generado por MongoDB y devolver `true` o `false` en función de si el restaurante se ha borrado satisfactoriamente o no.

2.  **Notas:**

    - Se debe comprobar que el número de teléfono es correcto a través de API Ninjas. Si no es correcto, la mutación devolverá un error de GraphQL.
    - No se permite más de un restaurante con el mismo número de teléfono. Si ya existe el número se debe devolver un error de GraphQL
    - Para obtener el clima actual, el país, y la hora local de la ubicación del restaurante, se utilizarán las API Ninjas:

**Entrega:**

- Enlace a una release de GitHub.
- Archivo comprimido generado en la release.
- Enlace al despliegue de la aplicación en Deno Deploy.

La falta de los dos primeros elementos supone un 0 en el examen.

**Instrucciones:**

- Crea una API GraphQL utilizando Deno con Apollo Server.
- Utiliza una base de datos MongoDB (Mongo Atlas) para almacenar y gestionar los datos.

**Evaluación:**

Se evaluará la funcionalidad, el diseño de la API, la implementación de la base de datos y la corrección del código.

**Criterios de evaluación de cada apartado:**

- **100% de la puntuación:**

  - La funcionalidad es tal y como se pide en el enunciado.
  - El código es correcto.

- **60% de la puntuación:**

  - La funcionalidad es tal y como se pide en el enunciado.
  - El código presenta errores o malas prácticas, como:
    - Errores no controlados.
    - Error en el tipado.
    - Código duplicado o redundante.
    - Consultas innecesarias o subóptimas a la base de datos.

- **30% de la puntuación:**

  - Faltan funcionalidades de las que se piden en el enunciado, pero las que están presentes son correctas.
  - El código es correcto (aunque incompleto).

- **0% de la puntuación:**

  - Faltan funcionalidades o las que están presentes son incorrectas.
  - El código presenta errores y malas prácticas.

**Normativa:**

- El examen se podrá realizar con ordenador propio u ordenador del aula.
- En caso de usar ordenador propio, cualquier problema técnico, incluyendo conectividad, será responsabilidad exclusiva del alumno.
- Se deberá grabar la pantalla completa en todo momento.
- No se podrá usar ningún otro tipo de apuntes o proyectos de ejemplo o código que esté localmente en el ordenador.
- Se podrá tener un proyecto iniciado y ya desplegado en Deno Deploy si se desea. El proyecto solo debe ser la parte habitual y común, no se puede tener un proyecto con código que luego no se necesite (por ejemplo, un proyecto completo de GitHub).
- No se pueden usar herramientas de IA (copilot, etc.) en VSCode o cualquier otro editor.
- Si el proyecto no funciona correctamente en Deno Deploy, será evaluado con una puntuación del 60% de la nota que se obtenga.
- Se pueden usar las siguientes URLs:
  - [https://deno.com/](https://deno.com/)
  - [https://www.typescriptlang.org/](https://www.typescriptlang.org/)
  - [https://www.npmjs.com/](https://www.npmjs.com/)
  - [https://www.mongodb.com/](https://www.mongodb.com/)
  - [https://developer.mozilla.org/](https://developer.mozilla.org/)
  - [https://www.apollographql.com/](https://www.apollographql.com/)
  - [https://graphql.org/](https://graphql.org/)
