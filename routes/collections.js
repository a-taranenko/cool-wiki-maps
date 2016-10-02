"use strict";

const express = require('express');
const router  = express.Router();
const bodyParser  = require("body-parser");
const app         = express();
app.use(bodyParser.urlencoded({ extended: true, type: "*/*" }));

module.exports = (knex) => {

  router.get("/:query", (req, res) => {
    knex
      .select("marker")
      .from("markers")
      .where('cid', req.params.query)
      .then((results) => {
        res.json(results);
    });
  });

  router.post("/addcollection", (req, res) => {
    let body = req.body;
    let cid = Math.floor(Math.random()*10e5)
    if (!req["collection"]) req.collection = {};
    console.log("Add Collection!")
    console.log(body)
    let stickItInThere = {
      id: undefined,
      owner_id: body.uid,
      cid: cid,
      collection_name: body.name,
      desc: body.desc
    }
    knex('collections').insert([stickItInThere], 'id')
    .then((count) => {
      console.log("added collection #", count)})
      req.collection.cid = cid
      res.render('index', {username: req.cookies.username, login: req.wikimap.login, cid: req.collection.cid})
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
