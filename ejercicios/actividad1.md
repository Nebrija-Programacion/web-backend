# Ejercicio 1

El objetivo del programa es crear una agenda a la que podemos añadir y borrar parámetros

En programa debe admitir los siguientes argumentos y parámetros

  * add // Añade una nota, asignándole un id generado aleatoriamente
    * title: string (required)
    * body: string (required)
    * author: string (required)
  * read // Lee una nota con el id especificado
    * id: string
  * list // lista todas las notas por id:title
  * remove // eliinar una nota con el id especificado
    * id: string

Cada vez que se ejecuta el programa:
  * Nada más abrir el programa se leen los datos previos del archivo datos.json
  * Al finalizar el programa se escriben los datos finales en el archivo datos.json