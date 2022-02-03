const express = require('express');
const cors = require('cors');

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

//Servidor estático:
const staticServerPath = "./src/public-react";
server.use(express.static(staticServerPath));

//Servidor estático - IMAGENES:
const staticServerImages = "./src/public-movies-images/";
server.use(express.static(staticServerImages));
