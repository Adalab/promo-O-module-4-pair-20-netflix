const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const dataMovies = require("./data/movies.json");
const users = require("./data/users.json");

// create and config server
// could use const App instead of const server
const server = express();
server.use(cors());
// nos permite usar body params en formato JSON
server.use(express.json());
//confirg. motor de plantillas:
server.set("view engine", "ejs");

// init express aplication

const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

// ENDPOINTS
// Creo el API que estoy solicitando desde el front
//Ruta/endpoint tipo GET ya que quiero devolver datos
//API request > GET > //localhost:4000/movies

server.get("/movies", (req, res) => {
  const genderFilterParam = req.query.gender;

  const filteredGenderMovies = dataMovies.movies.filter(
    (movie) => movie.gender === genderFilterParam
  );

  res.send(
    filteredGenderMovies.length === 0 ? dataMovies.movies : filteredGenderMovies
  );
});

//Ruta/endpoint tipo POST ya que quiero devolver un dato (userId) que depende de otros datos (user, login)
//API request > POST > //localhost:4000/login
server.post("/login", (req, res) => {
  console.log(req.body);
  const emailUserReq = req.body.email;
  const passwordUserReq = req.body.password;

  const findUser = users.find(
    (user) => user.email === emailUserReq && user.password === passwordUserReq
  );
  console.log(findUser);

  if (findUser) {
    res.send({
      success: true,
      userId: "id_de_la_usuaria_encontrada",
    });
  } else {
    res.send({
      success: false,
      errorMessage:
        "Usuaria/o no encontrada/o, por favor compruebe los datos introducidos",
    });
  }
});

//   4.4 Express JS III: - 1. Obtener el id de la película a renderizar:

server.get("/movie/:movieId", (req, res) => {
  const moviesId = req.params.movieId;
  // console.log(moviesId);
  //2. Obtener la película:
  const foundMovie = dataMovies.movies.find(
    (eachmovie) => eachmovie.id === moviesId
  );
//  console.log(foundMovie);
  // res.json(foundMovie);

  // //3. Renderiza una página cualquiera (ejs):
  res.render("movie", foundMovie); //movie: carpeta ejs
});

//Servidor estático:
const staticServerPath = "./src/public-react";
server.use(express.static(staticServerPath));

//Servidor estático - IMAGENES:
const staticServerImages = "./src/public-movies-images/";
server.use(express.static(staticServerImages));
