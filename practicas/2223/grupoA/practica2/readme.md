## Práctica 2

La solución a la práctica se debe entregar a través del campus virtual:
  * Añadiendo en la descripción un enlace a la releases de un repositorio de github (en caso de que el repositorio sea privado se debe invitar al usuario avalero como colaborador)
  * Subir el archivo .zip generado por la release de github.

Se pide realizar una API Rest usando Deno y Mongo DB como base de datos.
La base de datos debe estar alojada en MongoDB Atlas y el código debe contener el usuario y la contraseña para poder acceder a ella.

La API debe gestionar una red de taxis tipo Cabify, debe contener los siguientes endpoints (el alumno debe elegir el método adecuado: POST, GET, etc.)

  * `/addCar` - Permite añadir un coche a la base de datos. Devuelve los datos del coche añadido. Debe comprobar que no existe ya un coche con la misma matrícula.
  * `/removeCar/:id` - Permite eliminar un coche por id. 
    - Si el coche existe y no está ocupado devuelve un `200`, 
    - si no existe devuelve un `404`. 
    - Si existe, pero está ocupado devuelve un `405`.
  * `/car/:id` - Devuelve la información de un coche, incluyendo el status (ocupado o libre)
  * `/askCar` - Sirve para reservar un coche. Pone el `status` del coche a ocupado.
    - Si hay coches libres devuelve el `id` del coche
    - si no hay coches libres devuelve un `404` y un mensaje indicando que no hay coches. 
  * `/releaseCar/:id` - Sirve para liberar el coche por `id`. 
    - Si el `id` no existe devuelve un `404`, 
    - si existe, pero no estaba ocupado devuelve un `400`. 
    - Si existe y está ocupado lo libera y devuelve un `200`

el tipo Coche contiene
 - id
 - matrícula
 - número de plazas
 - status

### Puntuación

Cada apartado vale 2 puntos y se puntuará según el siguiente criterio
 - 0 puntos: No funciona como se ha pedido.
 - 1 punto: Funciona como se ha pedido pero hay errores de tipado (esto incluye que haya tipos `any` implícitos o explícitos) o se utilizan modos de código no adecuados, por ejemplo un `forEach` o un `for` si se puede resolver con un `map`.
 - 2 puntos. Funciona como se ha pedido y no hay errores.