# Practica II

Se pide realizar una API REST utilizando `Deno` y el servidor `oak`. La práctica debe trabajar con una base de datos Mongo alojada en Mongo Atlas.

## Endpoints

### GET /status
Indica que el servidor esta OK y listo para recibir peticiones.
`Status`: 200
`Body`: "OKProgramacion-I"


## GET /characters
Devuelve un objeto con todos los personajes de la serie
`Status`: 200
`Body`: Array de personajes, cada personaje con el formato del siguiente ejemplo.
```json
{
    id: 1,
    name: "Nombre der personaje",
    staus: "Alive",
    species: "Human",
    type: "Generic Experiment",
    gender: "Female",
    origin: "Nombre del origen",
    location: "Nombre de la ubicacion",
    image: "https://rickandmortyapi.com/api/character/avatar/4.jpeg",
    episode: [
        "nombre episodio 1",
        "nombre episodio 3",
        "nombre episodio 5",
    ]
}
``` 

## GET /character/:id
Devuelve un objeto con los datos del personaje con id
`Status`: 200
`Body`: objecto con el personaje con el formato del siguiente ejemplo.
```json
{
    id: 1,
    name: "Nombre der personaje",
    staus: "Alive",
    species: "Human",
    type: "Generic Experiment",
    gender: "Female",
    origin: "Nombre del origen",
    location: "Nombre de la ubicacion",
    image: "https://rickandmortyapi.com/api/character/avatar/4.jpeg",
    episode: [
        "nombre episodio 1",
        "nombre episodio 3",
        "nombre episodio 5",
    ]
}
``` 

## PUT /switchstatus/:id
Cambia el status de un personaje: de vivo a muerto o de muerto a vivo.
Devuelve un objeto con los datos del personaje con id (con el status actualizado)

Si lo realiza correctamente (el personaje existe)

`Status`: 200
`Body`: objecto con el personaje con el formato del siguiente ejemplo.
```json
{
    id: 1,
    name: "Nombre der personaje",
    status: "Alive",
    species: "Human",
    type: "Generic Experiment",
    gender: "Female",
    origin: "Nombre del origen",
    location: "Nombre de la ubicacion",
    image: "https://rickandmortyapi.com/api/character/avatar/4.jpeg",
    episode: [
        "nombre episodio 1",
        "nombre episodio 3",
        "nombre episodio 5",
    ]
}
``` 

Si el personaje no existe

```
Status: 404
Body: "Not Found"
```

## DELETE /character/:id
Borra un personaje con id

Si lo realiza correctamente (el personaje existe).
`Status`: 200
`Body`: "OK"

Si el personaje no existe
`Status`: 404
`Body`: "Not Found"
