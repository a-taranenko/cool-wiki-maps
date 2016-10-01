"use strict";

const express = require('express');
const router  = express.Router();



module.exports = (knex) => {

  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("users")
      .then((results) => {
        res.json(results);
    });
  });

  router.get('/validate', function (req, res) {
  console.log("validate query on: ", req.query.username)
  knex.raw('SELECT EXISTS (SELECT 1 FROM users WHERE username=?);', req.query.username)
    .then((response) => {
      console.log(response.rows[0].exists)
      if (response.rows[0].exists) {
        res.writeHead(400, 'That username is taken ),=')
        res.send()
      } else {
        res.sendStatus(200)
      }
    })
  });

  router.get('/:id',(req, res) => {
    knex
      .select('username')
      .from('users')
      .where({
        username: req.params.id
      })
      .then((results) => {
        res.json(results);
      });
  });
  return router;
}
