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

  router.post("/addcollection", (req, res) => {
    let body = req.body;
    console.log("Add Collection!")
    console.log(body)
    let stickItInThere = {
      id: undefined,
      owner_id: body.oid,
      cid: Math.floor(Math.random()*10e5),
      collection_name: body.name,
      desc: body.desc
    }
    knex('collections').insert([stickItInThere], 'id')
    .then((count) => {
      console.log("added collection #", count)})
    .catch((error) => {
      res.render("oops", {errorMessage: error})
    })
  })

  router.post("/addmarker/:cid", (req, res) => {
    let body = JSON.stringify(req.body);
    console.log("Add Marker!")
    console.log(body)
    let stickItInThere = {
      id: undefined,
      cid: req.params.cid,
      marker: body
    }
    knex('markers').insert([stickItInThere], 'id').then((count) => {console.log("added marker #", count)})
    .catch((error) => {
      res.render("oops", {errorMessage: error})
    })
  })

  // router.get("/add/:cid", (req, res) => {
  //   knex
  //     .select("marker")
  //     .from("markers")
  //     .where("cid", 1)
  //     .then((results) => {
  //       res.json(results);
  //     });
  // });

  return router;
}
