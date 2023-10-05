Por supuesto, aquí tienes el examen completo en formato Markdown, que incluye las preguntas, ejercicios y respuestas:


# Examen de JavaScript - Manipulación de Arrays

**Instrucciones:** Resuelve los siguientes ejercicios utilizando métodos de arrays en JavaScript. Usa TypeScript para tipar el código.

1. **Pregunta:** Filtrar números pares

   Dado el siguiente array de números, crea un nuevo array que contenga solo los números pares.

   ```typescript
   const numeros: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
   ```

   **Respuesta:**
   ```typescript
   const numerosPares: number[] = numeros.filter((num) => num % 2 === 0);
   ```

2. **Pregunta:** Encontrar estudiantes aprobados

   Dado un array de objetos que representan estudiantes con sus nombres y notas, crea un nuevo array con los nombres de los estudiantes que tienen una nota mayor o igual a 60.

   ```typescript
   const estudiantes: Estudiante[] = [
     { nombre: "Alice", nota: 85 },
     { nombre: "Bob", nota: 70 },
     { nombre: "Charlie", nota: 45 },
     { nombre: "David", nota: 60 },
   ];
   ```

   **Respuesta:**
   ```typescript
   const estudiantesAprobados: string[] = estudiantes
     .filter((estudiante) => estudiante.nota >= 60)
     .map((estudiante) => estudiante.nombre);
   ```

3. **Pregunta:** Suma de todos los números

   Utiliza el método `reduce` para calcular la suma de todos los números en el siguiente array.

   ```typescript
   const numeros: number[] = [5, 10, 15, 20, 25];
   ```

   **Respuesta:**
   ```typescript
   const sumaNumeros: number = numeros.reduce((acumulador, valorActual) => acumulador + valorActual, 0);
   ```

4. **Pregunta:** Encontrar la palabra más larga

   Dado un array de palabras, encuentra la palabra más larga.

   ```typescript
   const palabras: string[] = ["manzana", "banana", "fresa", "kiwi", "sandía"];
   ```

   **Respuesta:**
   ```typescript
   const palabraMasLarga: string = palabras.reduce((anterior, actual) => (actual.length > anterior.length ? actual : anterior));
   ```

5. **Pregunta:** Duplicar números pares y triplicar números impares

   Dado el siguiente array de números, crea un nuevo array donde los números pares se duplican y los números impares se triplican.

   ```typescript
   const numeros: number[] = [1, 2, 3, 4, 5, 6];
   ```

   **Respuesta:**
   ```typescript
   const numerosDuplicadosTriplicados: number[] = numeros.map((num) => (num % 2 === 0 ? num * 2 : num * 3));
   ```

6. **Pregunta:** Eliminar números repetidos

   Dado un array con números repetidos, crea un nuevo array que contenga solo valores únicos (sin duplicados).

   ```typescript
   const numeros: number[] = [1, 2, 2, 3, 4, 4, 5, 5];
   ```

   **Respuesta:**
   ```typescript
   const numerosUnicos: number[] = [...new Set(numeros)];
   ```

7. **Pregunta:** Encontrar estudiantes con la nota más alta

   Dado un array de objetos que representan estudiantes con sus nombres y notas, encuentra al estudiante con la nota más alta.

   ```typescript
   const estudiantes: Estudiante[] = [
     { nombre: "Alice", nota: 85 },
     { nombre: "Bob", nota: 70 },
     { nombre: "Charlie", nota: 92 },
     { nombre: "David", nota: 88 },
   ];
   ```

   **Respuesta:**
   ```typescript
   const estudianteNotaMasAlta: Estudiante | undefined = estudiantes.reduce((anterior, actual) =>
     actual.nota > (anterior ? anterior.nota : -1) ? actual : anterior
   );
   ```

8. **Pregunta:** Concatenar y ordenar nombres

   Dado el siguiente array de nombres, concatena todos los nombres en una sola cadena y ordénalos alfabéticamente.

   ```typescript
   const nombres: string[] = ["Alice", "David", "Charlie", "Bob"];
   ```

   **Respuesta:**
   ```typescript
   const nombresConcatenadosOrdenados: string = nombres.reduce((acumulador, nombre) => acumulador + nombre, "").split("").sort().join("");
   ```

9. **Pregunta:** Encontrar la suma de las notas

   Utiliza métodos de array para encontrar la suma de las notas de los

 estudiantes en el siguiente array de objetos.

   ```typescript
   const estudiantes: Estudiante[] = [
     { nombre: "Alice", nota: 85 },
     { nombre: "Bob", nota: 70 },
     { nombre: "Charlie", nota: 92 },
     { nombre: "David", nota: 88 },
   ];
   ```

   **Respuesta:**
   ```typescript
   const sumaNotas: number = estudiantes.reduce((acumulador, estudiante) => acumulador + estudiante.nota, 0);
   ```

10. **Pregunta:** Encontrar la primera letra única

    Dada una cadena de caracteres, encuentra la primera letra que no se repite en la cadena.

    ```typescript
    const cadena: string = "reconocer";
    ```

    **Respuesta:**
    ```typescript
    const primeraLetraUnica: string | undefined = cadena.split("").find((letra, index, arreglo) => arreglo.indexOf(letra) === arreglo.lastIndexOf(letra));
    ```
```

Este es el examen completo en formato Markdown, que incluye las preguntas, ejercicios y respuestas, con TypeScript para tipar el código. ¡Espero que sea útil para tus estudiantes!
