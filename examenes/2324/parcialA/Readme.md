
### Objetivo:
Desarrollar un API REST que permita gestionar una lista de contactos.

### Instrucciones:
1. Crea un API REST utilizando Deno con Express.
2. Utiliza una base de datos MongoDB (Mongo Atlas) para almacenar y gestionar datos.

### Agenda con cositas
Se trata de mantener una agenda de contactos, de los que podamos consultar sus datos así como la climatología y la hora actual del lugar donde viven.

La información necesaria para añadir un contacto es:

 - DNI (debe ser único en la DDBB).
 - Nombre y apellidos.
 - eMail.
 - Código postal
 - Código ISO del País en el que vive (se pueden consultar aquí: https://www.agenciatributaria.es/static_files/Sede/Procedimiento_ayuda/GC07/Codigo_paises.pdf).

La información que la API debe mostrar al solicitar un contacto es:

 - DNI
 - Nombre y apellidos
 - eMail
 - Código Postal
 - Ciudad dónde vive.
 - País donde vive.
 - Hora actual en el páis donde vive.
 - Condiciones metereológicas del lugar donde vive.

Se pueden usar las siguientes APIs para obtener la información necesaria:
 - https://zip-api.eu/
 - https://worldtimeapi.org/
 - https://www.weatherapi.com/
 - 
#### Endpoints:
*(cualquier error desconocido devolverá un status 500)*
- `GET /api/contactos`: Obtiene una lista de todos los contactos, indicando (solo) nombre y DNI **(1.5 puntos)**.
- `GET /api/contactos/:dni`: Obtiene información detallada (*DNI, Nombre, eMail, cp, ciudad, país, etc.* ) de un contacto según su DNI *- la climatología y la hora deben ser las del momento de realizar la consulta -* **(3.5 puntos)**.
   En caso de no existir el contacto con id indicado, devolverá un error 404
- `POST /api/contactos`: Crea un nuevo contacto **(2 puntos)**.
  Si ya existe el DNI en la DDBB devolverá un error 400.
  Si falta alguno de los datos o algún dato es erróneo devolverá un error 500
- `PUT /api/contactos/:dni`: Actualiza la información de un contacto por su DNI **(2 puntos)**.
  En caso de no existir el contacto con DNI indicado, devolverá un error 404
- `DELETE /api/contactos/:dni`: Borra un contacto por su DNI **(1 punto)**.
  En caso de no existir el contacto con id indicado, devolverá un error 404
