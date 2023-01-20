
## Examen Convoctoria Ordinaria	

Se pide realizar una API GraphQL que tenga la misma funcionalidad (idéntica) que las siguientes queries del API GraphQL de Rick and Morty https://rickandmortyapi.com/graphql.
```
type  Query {
   character(id: ID!): Character
   charactersByIds(ids: [ID!]!): [Character]
}
```
El alumno deberá completar el `schema` graphql oportunamente para que la funcionalidad y los datos sean idénticos.

Los datos se deben obtener mediante llamadas al API Rest de Rick and Morty : https://rickandmortyapi.com/documentation/#rest

**Nota**: *La profundidad de las queries en el API GraphQL de RickyMorty está limitada, sin embargo el API que debe realizar el alumno tendrá recursividad infinita*

### PUNTUACIÓN

 - La query `character(id: ID!): Character` devuelve exactamente lo mismo que la query del API GraphQL de Ricky Morty. **3 puntos**.
 - La query `charactersByIds(ids: [ID!]!): [Character]` devuelve examente lo mismo que la query del API GraphQL de Ricky Morty: **3 puntos**
 - El `schema` graphql es correcto: **1 punto**
 - Los parámetros de todos los resolvers están correctamente tipados (y están todos los resolvers necesarios): **1 punto**.
 - Los valores de retorno de todos los resolvers están correctamente tipados (y están todos los resolvers necesarios): **1.5 puntos**.
 - No hay dependencias en el import_map innecesarias, no fragamentos de código innecesarios, no archivos que no se usen. **0.5 puntos**

#### Rúbrica
Para cada item de evaluación:
- Perfecto: 100%
- Casi bien: 65%
- Algo bien: 30%
- Casi todo mal: 0%