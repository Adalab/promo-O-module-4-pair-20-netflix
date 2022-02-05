const express = require("express");
const cors = require("cors");
const dataMovies = require("./data/movies.json");

// const movieId = require;

// create and config server
const server = express();
server.use(cors());
server.use(express.json());
server.set("view engine", "ejs");

// create motor de plantillas
// server.get("/movie/:movieId", (req, res) => {
//   console.log(req.params.movieId);
// });

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

// Creo el API que estoy solicitando desde el front
//Ruta/endpoint tipo GET ya que quiero devolver datos
//API request > GET > //localhost:4000/movies

server.get("/movies", (req, res) => {
  const genderFilterParam = req.query.gender;
  console.log(genderFilterParam);

  const filteredGenderMovies = dataMovies.movies.filter(
    (movie) => movie.gender === genderFilterParam
  );
  console.log(filteredGenderMovies);
  res.send(
    filteredGenderMovies.length === 0 ? dataMovies.movies : filteredGenderMovies
  );
});

//Servidor estático:
const staticServerPath = "./src/public-react";
server.use(express.static(staticServerPath));

//Servidor estático - IMAGENES:
const staticServerImages = "./src/public-movies-images/";
server.use(express.static(staticServerImages));
