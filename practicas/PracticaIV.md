# Práctica III

Se desea crear un sistema de autenticación para una API GraphQL sencilla. Todos los datos se deben guardar en una base de datos MongoDB

Los datos disponibles deben ser

**Facturas** que contienen:
  * Fecha
  * Concepto
  * Cantidad
  * Titular (persona que paga la factura)

**Titulares**:
  * Nombre usuario (cadena de texto sin espacios)
  * contraseña
  * Facturas

## Paso I (3 puntos)

Crear la mutacion:
  * addUser: 
    * Recibe nombre de usuario y contraseña
    * Devuelve un Titular si ha sido creado con éxito o un error en caso contrario.


## Paso II (3 puntos)
  * login
    * Recibe nombre de usuario y contraseña
    * Devuelve un token (uuid.v4) en caso de que el login sea ok o un error en caso contrario.
  * logout
    * Recibe nombre de usuario y token.
    * Elimina el token de la base de datos si está loggeado. Si no está loggeado no hace nada.
  
## Paso III (4 puntos)

Crear la siguiente query.
  * getFacturas
    * Recibe nombre de usuario y token. 
    * Devuelve lista de facturas del usuario si está loggeado. En caso contrario devuelve un error.

Crear la siguiente mutacion

  * removeUser
    * Recibe nombre de usuario y token.
    * Elimina el usuario si este está loggeado, en caso contrario devuelve un error.