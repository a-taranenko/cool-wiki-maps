"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/", (req, res, next) => {
    knex
      .select("*")
      .from("collections")
      .then((results) => {
        res.locals.allMaps = results;
        next();
    });
  });

  return router;
}
