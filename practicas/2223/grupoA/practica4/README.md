## Práctica 4

La práctica se debe entregar a través del campus virtual:
  * Añadiendo en la descripción un enlace a la releases de un repositorio de github (**el repositorio debe ser privado y se debe invitar al usuario avalero como colaborador**)
  * Subir el archivo .zip generado por la release de github.

Se pide realizar una API GraphQL usando Deno y Mongo DB.

La base de datos debe estar alojada en MongoDB Atlas. En el repositorio se debe incluir un archivo `.env` con las credenciales de acceso a MongoDB Atlas. El código debe leer las credenciales del archivo `.env` y no podrán estar escritas directamente en el código.

La API debe gestionar un sistema de citas médicas. 

Las citas médicas (`slots`) contienen los siguientes datos:
  - `day` (número del 1 al 31)
  - `month` (número del 1 al 12, se debe comprobar que el día es correcto según el mes)
  - `year` (número)
  - `hour` (número entero del 0 al 23)
  - `available` (verdadero o falso)
  - `dni` (texto con el dni del paciente en el caso de que la cita haya sido pedida)

Para ello debe contener las siguientes queries/mutaciones. El alumno debe decidir si es query o mutation

#### `addSlot`
Permite al médico añadir un horario disponible para una cita. Por ejemplo, si añade lo siguiente:
  ```json
  {
    "day": 12,
    "month": 2,
    "year": 2023,
    "hour": 13
  }
  ```
  Creará una cita (`available:true`) el 12/2/2023.

  Al añadir una cita se debe comprobar que no haya ya una cita en ese horario:
   - Si ya hay una cita y está ocupada (`available:false`) devolverá un error `La cita ya existe y está ocupada`
   - Si ya hay una cita y está libre (`available:true`) la deja como está y devuelve los datos de la cita.
   - Si la cita no existe la añade y devuelve la cita.

  Si los datos de día, mes, año y hora son incorrectos devolverá un error `Datos incorrectos`

#### `removeSlot`
Permite al médico eliminar un horario disponible para una cita. Lo hará a través de los datos: `day`, `month`, `year`, `hour`

  Al eliminar una cita se debe comprobar que haya ya una cita en ese horario:
   - Si ya hay una cita y está ocupada (`available:false`) devolverá un error `La cita está ocupada`
   - Si ya hay una cita y está libre (`available:true`) la elimina y devuelve los datos de la cita

  
#### `availableSlots`
Permite a un paciente consultar las citas disponibles en un determinado día o en un determinado mes. Devolverá un array de citas. Si no hay citas disponibles devolverá un array estará vacío. 
  
  Hay dos opciones de parámetros
  
  * Parámetros `day`, `month`, `year`, devuelve un listado con todas las citas disponibles en el día, mes y año fijados.
  * Parámetros `month`, `year`, devuelve un listado con todas las citas disponibles en el mes y año fijados.

#### `bookSlot`
Permite al paciente reservar una cita concreta.
    * Si no existe una cita disponible ese día y hora devuelve un error `No existe una cita disponible`
    * Si existe una cita disponible la pondrá como ocupada y guardará el `dni` del paciente. Devolverá los datos de la cita

### Puntuación

Cada apartado vale 2.5 puntos y se puntuará según el siguiente criterio
 - 0 puntos: No funciona como se ha pedido.
 - 1.5 punto: Funciona como se ha pedido pero hay errores de tipado (esto incluye que haya tipos `any` implícitos o explícitos) o se utilizan modos de código no adecuados, por ejemplo un `forEach` o un `for` si se puede resolver con un `map`.
 - 2.5 puntos. Funciona como se ha pedido y no hay errores.
