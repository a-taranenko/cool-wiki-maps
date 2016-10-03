"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/", (req, res, next) => {
    let username = req.cookies.username
    res.locals.uid = {}
    knex
      .select("uid").from('users').where('username', username)
      .then((results) => {
        console.log(results[0].uid)
        res.locals.uid = results[0].uid;
      })
      .then(() => {
        knex
        .select("*")
        .from("collections")
          .then((results) => {
            console.log(results)
            res.locals.allMaps = results;
            let templateVars = { maps: res.locals.allMaps, username: req.cookies.username, uid: res.locals.uid};
            res.render("maps", templateVars)
          })
          .catch((error) => {
          res.render("oops", {errorMessage: error})
          })
      })
      .catch((error) => {
      res.render("oops", {errorMessage: error})
    })
  });

  return router;
}