
### Objetivo:
Desarrollar un API REST que permita gestionar una lista de monumentos destacables.

### Entrega:

-   Enlace a una release de github
-   Archivo comprimido generado en la release
-   Enlace al despliegue de la aplicación en Deno Deploy.

**La falta de uno de estos tres elementos supone un 0 en el examen**

*(La aplicación en Deno Deploy debe ser completamente funcional, guardando los datos en la DDBB correctamente)*

### Instrucciones:
1. Crea un API REST utilizando Deno con Express.
2. Utiliza una base de datos MongoDB (Mongo Atlas) para almacenar y gestionar datos.

### Monumentos reseñables
Se trata de mantener una lista de momentos reseñables, de los que podamos consultar su descripción, ubicación, así como la climatología y la hora actual del lugar.

La información necesaria para añadir un monumentos es:
 - Nombre, por ejemplo "Torre Eiffel".
 - Descripción.
 - Código postal, por ejemplo "75007"
 - Código ISO del País en el que vive (se pueden consultar aquí: https://www.agenciatributaria.es/static_files/Sede/Procedimiento_ayuda/GC07/Codigo_paises.pdf), or ejemplo "FR"

La información que la API debe mostrar al solicitar un monumento determinado
 - id (_id de MongoDB)
 - Nombre
 - Descripción
 - Código Postal
 - Ciudad dónde se encuentra
 - País donde se encuentra
 - Hora actual en el páis donde se encuentra
 - Condiciones metereológicas del lugar donde se encuentra

 Se pueden usar las siguientes API
  - https://zip-api.eu/
  - https://worldtimeapi.org/
  - https://www.weatherapi.com/s

#### Endpoints:
*(cualquier error desconocido devolverá un status 500)*
- `GET /api/monumentos`: Obtiene una lista de todos los monumentos, indicando (solo) id y nombre **(1.5 puntos)**.
- `GET /api/monumentos/:id`: Obtiene información detallada (*id, nombre, descripción, páis, ciudad, etc.* ) de un monumento según su id *- la climatología y la hora deben ser las del momento de realizar la consulta -* **(3.5 puntos)**.
   En caso de no existir el monumento con id indicado, devolverá un error 404
- `POST /api/monumentos`: Crea un nuevo monumento **(2 puntos)**.
  Si ya existe ese nombre, en el mismo código postal, en la DDBB devolverá un error 400.
  Si falta alguno de los datos o algún dato es erróneo devolverá un error 500
- `PUT /api/monumentos/:id`: Actualiza la información de un contacto por su id **(2 puntos)**.
  En caso de no existir el monumento con id indicado, devolverá un error 404
- `DELETE /api/monumentos/:id`: Borra un contacto por su id **(1 punto)**.
  En caso de no existir el monumento con id indicado, devolverá un error 404

### Evaluación:
Se evaluará la funcionalidad, el diseño del API, la implementación de la base de datos y la corrección del código. 

Los criterios de evaluación de cada apartado son los siguientes

#### 100% de la puntuación:
-   La funcionalidad es tal y como se pide en el enunciado.
-   El código es correcto.
#### 60% de la puntuación:
-   La funcionalidad es tal y como se pide en el enunciado.
-   El código presenta errores o malas praćticas
-   Errores no controlados.
-   Error en el tipado.
-   Código duplicado o redundante.
-   Consultas innecesarias o subóptimas a la DDBB
-   etc.
#### 30% de la puntuación:
-   Faltan funcionalidades de las que se piden en el enunciado pero las que están presentes son correctas.
-   El código es correcto (aunque incompleto).
#### 0% de la puntuación:
-   Faltan funcionalidades o las que están presentes son incorrectas.
-   El código presenta errores y malas prácticas.