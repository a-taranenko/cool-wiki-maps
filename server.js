"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();
const cookieParser= require('cookie-parser');
const querystring = require('querystring');
const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");
const loginRoutes = require("./routes/login");
const mapRoutes = require("./routes/map-list");


const collectionsRoutes = require("./routes/collections");

function sessionCheck(req, cb) {
  let sessionID = req.cookies.sessionID
  knex.raw('SELECT username, uid FROM users WHERE session_id=?;', sessionID)
    .then((response) => {
      console.log("Page requested by user:", response.rows[0])
      cb (null, response.rows[0])
  })
    .catch((error) => {
      cb (null, false)
    })
}


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
app.use(function(req, res, next) {
  if (!req["wikimap"]) req.wikimap = {}
  sessionCheck(req, (err, loggedin)=> {
    req.wikimap.login = loggedin
    next();
  })
})

// Mount all resource routes
app.use("/login", loginRoutes(knex));
app.use("/api/users", usersRoutes(knex));
app.use("/api/collections", collectionsRoutes(knex));
app.use("/maps", mapRoutes(knex));

// Home page
app.get("/", (req, res) => {
  res.render("index", {username: req.cookies.username, login: req.wikimap.login});
});

//Login page


//logout
// app.post("/logout", (req, res) => {
//   res.clearCookie("username");
//   res.redirect("/");
// });

//error page
// app.get("/oops", (req, res) => {
//   res.render("oops", {'error': req.body.error})
// })

app.get("/maps", (req, res) => {
  let templateVars = { maps: res.locals.allMaps };
  console.log(res.locals.allMaps);
  res.render("maps", templateVars);
});

// app.post("/api/collections/:id", (req, res) => {
//   console.log(req.params.body)
//   let updateData = querystring.parse(req.params.body)

//   // knex("collections").where("id", 1)
//   //   .update({markers: })

//   //   .then((results) => {
//   //     res.json(results);
//   // });
//   //res.redirect("/");
// });

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
