"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();
const cookieParser= require('cookie-parser');

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");
const loginRoutes = require("./routes/login");
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
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap-validator/dist'));
app.use(cookieParser())

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));
app.use("/login", loginRoutes(knex));

// Home page
app.get("/", (req, res) => {
  res.render("index", {username: req.cookies.username});
});

// Login page
app.get("/login", (req, res) => {
  res.render("login");
});

//logout
// app.post("/logout", (req, res) => {
//   res.clearCookie("username");
//   res.redirect("/");
// });

//error page
// app.get("/oops", (req, res) => {
//   res.render("oops", {'error': req.body.error})
// })

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
