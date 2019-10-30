#Práctica II

Se desea crear una API GraphQL para un recetario. La aplicacón contendrá:

**Recetas** que contienen:
  * Título
  * Descripción
  * Fecha de introducción
  * Autor
  * Ingredientes

**Autores**:
  * Nombre
  * e-mail.
  * Lista de recetas

**Ingredientes**
  * Nombre
  * Recetas en los que aparecen.


## Paso I (3 puntos)

Crear las mutaciones necesarias para poder añadir:
  * Recetas.
  * Autores.
  * Ingredientes.

## Paso II (3 puntos)

Crear las queries necesarias para poder consultar:
  * Lista de recetas.
  * Lista de autores.
  * Lista de ingredientes.
  * Recetas de un autor específico.
  * Recetas que contienen un ingrediente específico.

## Paso III (4 puntos)

Crear las mutaciones necesarias para poder:
  * Borrar una receta.
  * Borrar un autor. Al borrar un autor, se borran todas sus recetas.
  * Borrar un ingrediente. Al borrar un ingrediente, se borran todas las recetas que lo contengan.
  * Actualizar datos de un autor.
  * Actualizar datos de una receta.
  * Actualizar datos de un ingrediente.