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

  router.post("/add/:cid", (req, res) => {
    let body = JSON.stringify(req.body);
    console.log("Heres your shit asshole:")
    console.log(body)
    let stickItInThere = {
      id: undefined,
      cid: req.params.cid,
      marker: body
    }
    knex('markers').insert([stickItInThere], 'id').then((count) => {console.log("added", count, "marker")})
    .catch((error) => {
      res.render("oops", {errorMessage: error})
    })
  })

  router.get("/add/:cid", (req, res) => {
    knex
      .select("marker")
      .from("markers")
      .where("cid", 1)
      .then((results) => {
        res.json(results);
      });
  });

  return router;
}
