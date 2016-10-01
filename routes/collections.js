"use strict";

const express = require('express');
const router  = express.Router();
const bodyParser  = require("body-parser");
const app         = express();
app.use(bodyParser.urlencoded({ extended: true, type: "*/*" }));

module.exports = (knex) => {

  router.get("/:query", (req, res) => {
    knex
      .select("markers")
      .from("collections")
      .where('name',req.query.name)
      .then((results) => {
        res.json(results);
    });
  });

  router.post("/add", (req, res) => {
    let body = JSON.stringify(req.body);
    console.log("Heres your shit asshole:")
    console.log(body)
    //let updateData = querystring.parse(req.body)
  })

  return router;
}
