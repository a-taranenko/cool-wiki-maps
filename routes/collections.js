"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/:query", (req, res) => {
    console.log(req.query.name)
    knex
      .select("markers")
      .from("collections")
      .where("name",req.query.name)
      .then((results) => {
        res.json(results);
    });
  });

  return router;
}
