"use strict";

const express = require('express');
const router  = express.Router();
const bodyParser = require('body-parser');
const app         = express();
const CryptoCookie = require('crypto-cookie');
const crypto = require('crypto');
const randNumGen = require('../saltGen');

app.use(bodyParser.json());



module.exports = (knex) => {

  router.post("/", (req, res) => {
    let cookie = new CryptoCookie(req, res);
    let body = req.body;
    console.log(body);
    knex
      .select("*")
      .from("users")
      .where({
        username: body.username
    })
    .then((results) => {
      console.log(results)
      console.log(results[0])
      if (results[0].password !== body.password) {
        console.log("Verification failed! D=")
        throw err;
      } else {
        return results;
      }
    })
    .then((results) => {
      let randID = randNumGen(36);
      console.log(randID);
      knex.select('users').where({username: results[0].username}).update({session_id: randID})
      return randID
      })
    .then((randID) => {
      res.cookie('sessionID', randID)
      res.redirect('/')
    })
  });

  router.get('/:id',(req, res) => {
    knex
      .select('*')
      .from('users')
      .where({
        id: req.params.id
      })
      .then((results) => {
        res.json(results);
      });
  });
  return router;
}