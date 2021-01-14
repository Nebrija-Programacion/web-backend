# Practica V

Se desea realizar una API para un bloq que gestione usuarios con distintos roles:
 * ADMIN
 * AUTHOR
 * EDITOR
 * USER

El blog esta compuesto de posts con los siguientes campos:
 * Titulo
 * Cuerpo del post
 * Autor del post
 * Comentarios de los lectores.

Cada entra del blog además tendrá comentarios, que tendrán:
 * Texto del comentario.
 * Autor del comentario.

La funcionalidad que ofrece la API es la siguiente:
 * Crear y borrar usuarios (indicando los roles). Solo lo pueden hacer los ADMIN.
 * Crear posts. Lo pueden hacer los AUTHOR (también puede borrar los suyos, pero no los de otros)
 * Borrar posts. Los EDITOR pueden borrar cualquier post.
 * Leer posts. Lo puede hacer cualquiera. _getPosts_
 * Añadir comentarios a un post y borrar los comentarios de uno mismo. Lo pueden hacer solo los USER.
 * Borrar comentarios de cualquiera. Lo pueden hacer solo los EDITOR

Un usuario podría tener a la vez varios roles, por ejemplo: [EDITOR, USER] 

Desarrollar la API que ofrece toda esta funcionalidad.

### Nota
Para que la API funcione se debe partir de un usuario ADMIN creado directamente en la base de datos que pueda crear las cuentas del resto de usuarios.

### Puntos:
* Schema de graphql y mongo (tipos): 2 puntos.
* Implementación de las queries adecuadas: 2 puntos.
* Implementación las mutaciones adecuadas: 2 puntos.
* Gestión correcta de los roles (autenticación): 4 puntos.
 
