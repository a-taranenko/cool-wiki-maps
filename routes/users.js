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

  router.get('/all',(req, res) => {
    knex
      .select('username', 'name', 'email', 'uid')
      .from('users')
      .then((results) => {
        console.log(JSON.stringify(results))
        //res.json(results);
        //res.locals.allUsers = JSON.stringify(results);
        res.render('usertable', {allUsers: JSON.stringify(results)});
      });
  });

  router.get(('/:username'), (req, res) => {
    // SELECT users.name, username, email, collections.name, collections.desc FROM users JOIN collections ON (uid = owner_id) WHERE username = 'mrtesty';
    knex('users')
      .select('name', 'username', 'email')
      .where('users.username', req.params.username)
      .then((results) => {
        console.log(results)
        let passIN = {
          name: results[0].name,
          username: results[0].username,
          email: results[0].email
        }
        res.render('profile', passIN);
      });
  });

  return router;
}
