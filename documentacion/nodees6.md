#Creación de un proyecto en Node.js con soporte para ES**** (current)

## Paso 1 - npm y node con nvm
[instalamos node y npm](./nvm.md).

## Paso 2 - creación del archivo de proyecto package.json

```bash
$ mkdir project_name
$ cd project_name
$ npm init
``` 
Indicamos toda la información pertinente al proyecto.

## Paso 3. nodemon para la ejecuión continua

```bash
$ npm install nodemon --save-dev
``` 
## Paso 4. babel para la transpilación

```bash
$ npm install @babel/core @babel/node @babel/preset-env @babel/cli --save-dev
``` 

Creamos y editamos el archivo de configuración de babel

```bash
$ touch .babelrc
``` 

y añadimos lo siguiente

```
{
  "presets": [
    "@babel/preset-env"
  ]
}
```

## Añadimos el script para lanzar

En el archivo package.json

```
{
  ...
  "main": "index.js",
  "scripts": {
    "build": "babel src --out-dir dist",
    "start": "nodemon --exec babel-node src/app.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  ...
}
``` 

Mas informacion https://hackernoon.com/using-babel-7-with-node-7e401bc28b04

