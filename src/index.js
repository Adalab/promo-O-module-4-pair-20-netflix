const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const dataMovies = require("./data/movies.json");
const users = require("./data/users.json");

// create and config server
const server = express();
server.use(cors());
server.use(express.json());
server.set("view engine", "ejs");

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

// DB
const db = new Database("./src/db/database.db", {
  verbose: console.log(),
});

server.get("/movies", (req, res) => {
  //req
  const genderFilterParams = req.query.gender;
  const sortFilterParams = req.query.sort;
  //prepare queries
  const queryAll = db.prepare("SELECT * FROM movies ORDER BY name");
  const queryAllSortDesc = db.prepare(
    "SELECT * FROM movies ORDER BY name DESC"
  );
  const queryGender = db.prepare(
    "SELECT * FROM movies WHERE gender = ? ORDER BY name"
  );
  const queryGenderSortDesc = db.prepare(
    "SELECT * FROM movies WHERE gender = ? ORDER BY name DESC"
  );
  const allMovies = queryAll.all();
  const allMoviesSorted = queryAllSortDesc.all();
  const moviesGender = queryGender.all(genderFilterParams);
  const moviesSortedGender = queryGenderSortDesc.all(genderFilterParams);
  //res
  if (moviesGender.length !== 0 && sortFilterParams === "desc") {
    res.send(moviesSortedGender);
  } else if (moviesGender.length !== 0 && sortFilterParams === "asc") {
    res.send(moviesGender);
  } else if (moviesGender.length === 0 && sortFilterParams === "desc") {
    res.send(allMoviesSorted);
  } else if (moviesGender.length === 0 && sortFilterParams === "asc") {
    res.send(allMovies);
  }
});

server.post("/login", (req, res) => {
  //req
  const emailUserReq = req.body.email;
  const passwordUserReq = req.body.password;
  //prepare queries
  const findUser = users.find(
    (user) => user.email === emailUserReq && user.password === passwordUserReq
  );

  //res
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

server.get("/movie/:movieId", (req, res) => {
  //req
  const moviesIdReq = req.params.movieId;
  //prepare queries
  const query = db.prepare("SELECT * FROM movies WHERE id = ?");
  const foundMovie = query.get(moviesIdReq);
  //res
  res.render("movie", foundMovie);
});

server.post("/sign-up", (req, res) => {
  //req
  const emailParams = req.body.email;
  const passwordParams = req.body.password;
  //prepare queries
  const queryUserEmail = db.prepare("SELECT * FROM users WHERE email = ?");
  const foundUser = queryUserEmail.get(emailParams);
  //res
  if (foundUser === undefined) {
    const query = db.prepare(
      "INSERT INTO users (email, password) VALUES (?,?)"
    );
    const newUserInsert = query.run(emailParams, passwordParams);
    res.send({
      success: true,
      userId: newUserInsert.lastInsertRowid,
    });
  } else {
    res.send({
      success: false,
      errorMessage: "Usuaria ya existente",
    });
  }
});

const staticServerPath = "./src/public-react";
server.use(express.static(staticServerPath));

const staticServerImages = "./src/public-movies-images/";
server.use(express.static(staticServerImages));

const staticServerStyles = "./src/styles/";
server.use(express.static(staticServerStyles));
