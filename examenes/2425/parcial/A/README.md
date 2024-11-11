````markdown
# Examen Parcial

## Normativa

- Se debe grabar a través del campus virtual la pantalla completa del ordenador.
  La no grabación de la pantalla supone un No Presentado en el examen.
  - Para grabar: Menú vertical derecho > Libros y Herramientas > Salas
    Individuales.
- No se puede usar ninguna extensión con Inteligencia Artificial (como GitHub
  Copilot).
- Solo se pueden utilizar las siguientes URLs de internet. El uso de cualquier
  otra página web supone el suspenso del examen:
  - [https://deno.com/](https://deno.com/)
  - [https://www.typescriptlang.org/](https://www.typescriptlang.org/)
  - [https://www.npmjs.com/](https://www.npmjs.com/)
  - [https://www.mongodb.com/](https://www.mongodb.com/)
  - [https://developer.mozilla.org/](https://developer.mozilla.org/)

## Entrega

Para que el examen sea evaluado se deben entregar los siguientes elementos a
través del Campus Virtual:

1. Enlace a una release de un repositorio público de GitHub conteniendo el
   código de la solución, las variables de entorno y todos los archivos
   oportunos para su ejecución (como `deno.json`).
2. Archivo comprimido generado por la release.

## Enunciado

Desarrollar una API REST que permita gestionar una red de personas. Los datos de
las personas deben ser almacenados en una base de datos MongoDB Atlas. La API
debe permitir realizar las operaciones que se indican sobre las personas, y
almacenar la siguiente información para cada una:

- Nombre de la persona.
- Email (único, no puede haber dos personas con el mismo email).
- Teléfono (único, no puede haber dos personas con el mismo teléfono).
- Amigos (un listado de personas amigas, referenciando los documentos de otras
  personas).

## Requisitos

- Crear una API REST que permita interactuar con los datos de personas.
- Utilizar MongoDB Atlas para almacenar la información.
- No debe permitirse tener dos personas con el mismo email ni con el mismo
  teléfono.
- Los amigos de una persona serán un array de IDs de otras personas de la red.

## Tecnologías

- **Backend**: Deno + TypeScript.
- **Base de datos**: MongoDB Atlas.
- **Validaciones**: Validar que el email y el teléfono sean únicos antes de
  insertar los datos en la base de datos.

---

## Desarrollo de la API

### Endpoints

1. **Crear una persona**

   - **Método**: `POST`
   - **Ruta**: `/personas`
   - **Descripción**: Permite crear una nueva persona, asegurándose de que el
     email y el teléfono sean únicos.

   #### Request (Body):

   ```json
   {
     "nombre": "Juan Pérez",
     "email": "juan@example.com",
     "telefono": "+123456789",
     "amigos": ["5fca76d4f4c2b5fbb788d121", "5fca76d4f4c2b5fbb788d122"]
   }
   ```
````

#### Respuesta exitosa (201 Created):

```json
{
  "message": "Persona creada exitosamente",
  "persona": {
    "id": "5fca76d4f4c2b5fbb788d123",
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "telefono": "+123456789",
    "amigos": [
      {
        "id": "5fca76d4f4c2b5fbb788d121",
        "nombre": "Ana López",
        "email": "ana@example.com",
        "telefono": "+987654321"
      },
      {
        "id": "5fca76d4f4c2b5fbb788d122",
        "nombre": "Carlos Díaz",
        "email": "carlos@example.com",
        "telefono": "+123123123"
      }
    ]
  }
}
```

#### Errores comunes:

- **400 Bad Request**: Si el email o el teléfono ya existen.

  ```json
  {
    "error": "El email o teléfono ya están registrados."
  }
  ```

2. **Obtener la lista de personas**

   - **Método**: `GET`
   - **Ruta**: `/personas`
   - **Descripción**: Permite obtener una lista de todas las personas. Se puede
     filtrar por nombre usando search parameters. Si no hay search parameters se
     devolverán todas las personas.

   #### Ejemplo de uso:

   ```
   GET /personas?nombre=Juan
   ```

   #### Respuesta exitosa (200 OK):

   ```json
   [
     {
       "id": "5fca76d4f4c2b5fbb788d123",
       "nombre": "Juan Pérez",
       "email": "juan@example.com",
       "telefono": "+123456789",
       "amigos": [
         {
           "id": "5fca76d4f4c2b5fbb788d121",
           "nombre": "Ana López",
           "email": "ana@example.com",
           "telefono": "+987654321"
         },
         {
           "id": "5fca76d4f4c2b5fbb788d122",
           "nombre": "Carlos Díaz",
           "email": "carlos@example.com",
           "telefono": "+123123123"
         }
       ]
     }
   ]
   ```

3. **Obtener una persona por parámetros de búsqueda**

   - **Método**: `GET`
   - **Ruta**: `/persona`
   - **Descripción**: Permite obtener la información de una persona usando
     parámetros de búsqueda, como email.

   #### Ejemplo de uso:

   ```
   GET /persona?email=juan@example.com
   ```

   #### Respuesta exitosa (200 OK):

   ```json
   {
     "id": "5fca76d4f4c2b5fbb788d123",
     "nombre": "Juan Pérez",
     "email": "juan@example.com",
     "telefono": "+123456789",
     "amigos": [
       {
         "id": "5fca76d4f4c2b5fbb788d121",
         "nombre": "Ana López",
         "email": "ana@example.com",
         "telefono": "+987654321"
       },
       {
         "id": "5fca76d4f4c2b5fbb788d122",
         "nombre": "Carlos Díaz",
         "email": "carlos@example.com",
         "telefono": "+123123123"
       }
     ]
   }
   ```

   #### Errores comunes:

   - **404 Not Found**: Si no se encuentra una persona con ese email o teléfono.

     ```json
     {
       "error": "Persona no encontrada."
     }
     ```

4. **Actualizar una persona**

   - **Método**: `PUT`
   - **Ruta**: `/persona`
   - **Descripción**: Permite actualizar los datos de una persona. Se buscará la
     persona por email.

5. **Eliminar una persona**

   - **Método**: `DELETE`
   - **Ruta**: `/persona`
   - **Descripción**: Elimina una persona de la base de datos. Se buscará la
     persona por email.

---

## Rúbrica Evaluación

- Crear una persona (1.5 puntos)
- Obtener la lista de personas (1.5 puntos)
- Obtener una persona por email (1.5 puntos)
- Actualizar una persona (1.5 puntos)
- Eliminar una persona (1.5 puntos)
- Agregar un amigo a una persona (1.5 puntos)
- Declaración y uso correcto de tipos (incluye modelo de datos en la DDBB) (1
  punto)

## Valoración

- **0%** - No funciona o hay errores graves de código.
- **40%** - Funciona aunque faltan algunas cosas (como la validación de datos,
  respuestas de error, etc.)
- **70%** - Funciona correctamente (todas las funcionalidades pedidas y
  validación de datos ok) y el código presenta solo errores menores.
- **100%** - Funciona correctamente y el código no presenta errores.

```
```
