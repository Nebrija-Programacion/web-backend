# Práctica I

Se desear crear un API en GraphQL para servir información sobre RickyMorty. A continuación se describirán las queries y qué información deben ofrecer.

Para ello se debe partir de un `array` que contenga todos los personajes de RickyMorty según lo visto en clase. Sólo se realizará una petición a la API para contruir este `array`, el resto del programa tomará los datos del `array`, y no se harán más llamadas a la API

## Paso I (2 puntos)
Guardar el `array` de datos en un archivo en formato JSON (`JSON.stringify(array)`). Si cuando la API se inicia el archivo de texto ya existe, reconstruye el `array` a partir del archivo de texto. Si no existe, reconstruye el `array` a partir de la API pública de RickyMorty y crea el archivo JSON.

## Paso II (2 Puntos)
Desarrollar un tipo de dato, llamado `Character` que incluya:
 - id: El id del personaje.
 - name: El nombre del personaje
 - status: Vivo o muerto.
 - planet: Planeta al que pertenece.

Desarrollar una query `character` que reciba como argumento el `id` y devuelva el `Character` correspondiente.

## Paso III (2 puntos)

Desarrollar una query `characters` que reciba como argumentos:
 - page: número de página, por defecto 1.
 - pageSize: número de personajes por paǵina, por defecto 20.

Debe devolver un `array` de `Character`.

## Paso IV (2 puntos)

Completar la query `characters` con los siguientes argumentos:
 - name: Personajes que contengan el nombre.
 - status: vivo o muerto, filtro de qué personajes mostrar
 - planet: fitro por nombre de planeta.

### Paso V (2 puntos)

Desarrollar una query `planets` que devuelva un listado con todos los planetas existentes (sin repetirse - para conseguir esto buscar en Google como eliminar duplicados en un `array`).