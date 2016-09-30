"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/", (req, res) => {
    knex
      .select("markers")
      .from("collections")
      .where('id',1)
      .then((results) => {
        res.json(results);
    });
  });

  return router;
}
