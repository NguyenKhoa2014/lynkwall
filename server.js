"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");
const resourcesRoutes = require("./routes/resources");
const categoriesRoutes = require("./routes/categories");
const apiCategoriesRoutes = require("./routes/api_categories");
const apiLikesRoutes = require("./routes/api_likes");
const apiRatingsRoutes = require("./routes/api_ratings");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/css",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes

app.use("/resources", resourcesRoutes(knex));
app.use("/users", usersRoutes(knex));
app.use("/categories", categoriesRoutes(knex));
app.use("/api/v1/categories", apiCategoriesRoutes(knex));
app.use("/api/v1/likes", apiLikesRoutes(knex));
app.use("/api/v1/ratings", apiRatingsRoutes(knex));

// Home page
app.get("/", (req, res) => {
  knex
  .select("*")
  .from("resources")
  .then((resources) => {
      res.render("index",
      {
        resources: resources,
      });    
  });
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
