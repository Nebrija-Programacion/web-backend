# Prácticas IV y V

Crear una API en graphQL que permita gestionar un blog de recetas. Los datos se guardarán en MongoDB Atlas.

La API debe tener los siguientes resolvers.

### SignIn
Permite registrarse con usuario y contraseña.

### SignOut
Permite a un usuario loggeado borrar su cuenta. Borra todas sus recetas.

### LogIn
Permite loggearse con usuario y contraseña.

### LogOut
Permite desloggearse cuando el usuario tiene la sesión iniciada.

### AddIngredient
Añade un ingrediente a la base de datos. Solo usuarios registrados.

### DeleteIngredient
Borra un ingrediente de la base de datos y todas las recetas que contengan ese ingrediente. Solo usuarios registrados. Solo puedes borrar el ingrediente si es tuyo. Se borran todas las recetas, aunque no sean tuyas.

### AddRecipe
Añade una receta a la base de datos. Solo usuarios registrados.

### UpdateRecipe
Actualiza una receta existente en la base de datos. Solo usuarios registrados. Solo puedes actualizar la receta si es tuya.

### DeleteRecipe
Borra una receta de la base de datos. Solo usuarios registrados. Solo puedes borrar la receta si es tuya.

### getRecipes
Devuelve todas las recetas. 

Tiene los siguientes parámetros opcionales (se pueden pasar ambos, uno, o ninguno):
 * author. Devuelve las recetas de un autor particular.
 * ingredient. Devuelve todas las recetas que contengan el ingrediente

### getRecipe
Devuelve la receta pedida por id

### getUser
Devuelve un usuario pedido por id

### getUsers
Devuelve todos los usuarios

Los tipos graphql son los siguientes (se pueden crear otros si se considera necesario)

```
type Ingredient{
  id: ID!
  name: String!
  recipes: [Recipe!]!
}

type Recipe{
  id: ID!
  name: String!
  description: String!
  ingredients: [Ingredient!]!
  author: User!
}

type User{
  id: ID!
  email: String!
  pwd: String!
  token: String
  recipes: [Recipe!]!
}
``` 

Se valorará:
 * La elección de los modelos de datos adecuados para Mongo.
 * El tipado correcto y exhaustivo de todo el código.
 * La optimización de las llamadas a Mongo, evitando llamadas innecesarias o resolver cosas con código que se pueden resolver en la query de Mongo. Por ejemplo, sería mala práctica pedir a Mongo TODAS las recetas y luego filtrarlas en javascript por author.
 * El correcto encadenado de los resolvers.
 * Utilizar variables de entorno en un archivo `.env` para datos confidenciales.
 * Añadir un `Readme.md` al respositorio explicando cómo lanzar el proyecto.
 * Añadir a github todos los archivos necesarios y *solo* los necesarios.


No se evaluarán aquellos proyectos que no se ejecuten directamente en mi ordenador sin necesidad de añadir dependencias adicionales. Todas las dependencias necesarias (expecto TypeScript, Node y npm) deben estar en el `package.json`.
