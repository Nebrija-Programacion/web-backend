# Examen Parcial

## Normativa

- Se debe grabar a través del campus virtual la pantalla completa de ordenador. La no grabación de la pantalla supone un No Presentado en el examen.
- Para grabar: **Menú vertical derecho** > **Libros y Herramientas** > **Salas individuales** (la grabación de la sala la activa el profesor).
- No se puede usar ninguna extensión con Inteligencia Artificial (como GitHub Copilot).
- Solo se pueden utilizar las siguientes URLs de internet. El uso de cualquier otra página web supone el suspenso del examen:

  - https://deno.com/
  - https://www.typescriptlang.org/
  - https://www.npmjs.com/
  - https://www.mongodb.com/
  - https://developer.mozilla.org/

## Entrega

Para que el examen sea evaluado se deben entregar los siguientes elementos a través del Campus Virtual:

- Enlace a una **release** de un repositorio público de **GitHub** conteniendo el código de la solución y las variables de entorno.
- Archivo comprimido generado por la release.

## Examen Parcial: Desarrollo de una API para un catálogo de libros con MongoDB

### Enunciado

Se desea realizar una API para gestionar el inventario de una biblioteca. En el sistema se deben almacenar los datos de los libros y sus autores. Cada libro estará asociado a uno o varios autores por sus IDs. Además, se gestionará la cantidad de copias disponibles de cada libro.

### Requerimientos

Se debe almacenar en una base de datos **MongoDB Atlas** la siguiente información:

1. **Libros**:
    - **Título**: Nombre del libro.
    - **Autores**: Lista de IDs de los autores del libro (cada autor se representa por su ID único).
    - **Copias Disponibles**: Número de copias disponibles en la biblioteca.

2. **Autores**:
    - **Nombre Completo**: Nombre completo del autor.
    - **Biografía**: Breve biografía del autor.

El estudiante deberá decidir el modelo de datos más adecuado para almacenar esta información en la base de datos.

### Endpoints de la API

Se deben desarrollar los siguientes endpoints con los métodos **GET**, **POST**, **PUT** y **DELETE**, sin utilizar rutas dinámicas, solo usando **body** o **searchparams**.

#### 1. Crear un libro

- **Método**: POST
- **Ruta**: /libro
- **Descripción**: Permite crear un nuevo libro en la biblioteca, incluyendo su título, autores y copias disponibles.

**Request (Body)**:

```json
{
  "titulo": "1984",
  "autores": ["5fca76d4f4c2b5fbb788d121", "5fca76d4f4c2b5fbb788d122"],
  "copiasDisponibles": 5
}
```

**Respuesta exitosa (201 Created)**:

```json
{
  "message": "Libro creado exitosamente",
  "libro": {
    "id": "5fca76d4f4c2b5fbb788d123",
    "titulo": "1984",
    "autores": [
      { "id": "5fca76d4f4c2b5fbb788d121", "nombre": "George Orwell" },
      { "id": "5fca76d4f4c2b5fbb788d122", "nombre": "Otro Autor" }
    ],
    "copiasDisponibles": 5
  }
}
```

**Errores comunes**:

- **400 Bad Request**: Si faltan datos requeridos (por ejemplo, si no se incluye el título o los autores).
  
  ```json
  {
    "error": "El título y los autores son campos requeridos."
  }
  ```

- **400 Bad Request**: Si alguno de los autores no existe.

  ```json
  {
    "error": "Autor no existe"
  }
  ```

#### 2. Obtener la lista de libros

- **Método**: GET
- **Ruta**: /libros
- **Descripción**: Obtiene una lista de todos los libros disponibles en la biblioteca. Se puede filtrar por título usando parámetros de búsqueda (si no se da el título devuelve todos los libros).

**Ejemplo de uso**:

```http
GET /libros?titulo=1984
```

**Respuesta exitosa (200 OK)**:

```json
[
  {
    "id": "5fca76d4f4c2b5fbb788d123",
    "titulo": "1984",
    "autores": [
      { "id": "5fca76d4f4c2b5fbb788d121", "nombre": "George Orwell" },
      { "id": "5fca76d4f4c2b5fbb788d122", "nombre": "Otro Autor" }
    ],
    "copiasDisponibles": 5
  }
]
```

**Errores comunes**:

- **404 Not Found**: Si no se encuentran libros con el título especificado.

  ```json
  {
    "error": "No se encontraron libros con ese título."
  }
  ```

#### 3. Obtener un libro por ID

- **Método**: GET
- **Ruta**: /libro
- **Descripción**: Permite obtener un libro utilizando su ID.

**Ejemplo de uso**:

```http
GET /libros?id=5fca76d4f4c2b5fbb788d123
```

**Respuesta exitosa (200 OK)**:

```json
{
  "id": "5fca76d4f4c2b5fbb788d123",
  "titulo": "1984",
  "autores": [
    { "id": "5fca76d4f4c2b5fbb788d121", "nombre": "George Orwell" },
    { "id": "5fca76d4f4c2b5fbb788d122", "nombre": "Otro Autor" }
  ],
  "copiasDisponibles": 5
}
```

**Errores comunes**:

- **404 Not Found**: Si no se encuentra un libro con el ID especificado.

  ```json
  {
    "error": "Libro no encontrado."
  }
  ```

#### 4. Actualizar un libro

- **Método**: PUT
- **Ruta**: /libro
- **Descripción**: Permite actualizar los detalles de un libro, como su título, autores o copias disponibles (el libro se actualiza identificándolo por su id).

**Request (Body)**:

```json
{
  "id": "5fca76d4f4c2b5fbb788d123",
  "titulo": "1984 (Edición 2024)",
  "autores": ["5fca76d4f4c2b5fbb788d121"],
  "copiasDisponibles": 10
}
```

**Respuesta exitosa (200 OK)**:

```json
{
  "message": "Libro actualizado exitosamente",
  "libro": {
    "id": "5fca76d4f4c2b5fbb788d123",
    "titulo": "1984 (Edición 2024)",
    "autores": [
      { "id": "5fca76d4f4c2b5fbb788d121", "nombre": "George Orwell" }
    ],
    "copiasDisponibles": 10
  }
}
```

**Errores comunes**:

- **400 Bad Request**: Si faltan campos obligatorios.

  ```json
  {
    "error": "Faltan campos"
  }
  ```

- **404 Not Found**: Si el ID no existe.

  ```json
  {
    "error": "El ID del libro no existe."
  }
  ```

#### 5. Eliminar un libro

- **Método**: DELETE
- **Ruta**: /libro
- **Descripción**: Elimina un libro de la base de datos utilizando su ID.

**Request (Body)**:

```json
{
  "id": "5fca76d4f4c2b5fbb788d123"
}
```

**Respuesta exitosa (200 OK)**:

```json
{
  "message": "Libro eliminado exitosamente."
}
```

**Errores comunes**:

- **404 Not Found**: Si no se encuentra el libro con el ID especificado.

  ```json
  {
    "error": "Libro no encontrado."
  }
  ```

#### 6. Crear un autor

- **Método**: POST
- **Ruta**: /autor
- **Descripción**: Permite crear un nuevo autor con su nombre completo, biografía y lista de libros publicados (referenciados por sus IDs).

**Request (Body)**:

```json
{
  "nombre": "George Orwell",
  "biografia": "George Orwell fue un escritor y periodista británico..."
}
```

**Respuesta exitosa (201 Created)**:

```json
{
  "message": "Autor creado exitosamente",
  "autor": {
    "id": "5fca76d4f4c2b5fbb788d121",
    "nombre": "George Orwell",
    "biografia": "George Orwell fue un escritor y periodista británico..."
  }
}
```

