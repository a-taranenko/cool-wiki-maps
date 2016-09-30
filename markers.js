"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/", (req, res) => {
    console.log('blah')
    knex
      .select("markers")
      .from("collections")
      .where('id',1)
      .then((results) => {
        console.log(results)
        res.json(results);
    });
  });

  return router;
}
