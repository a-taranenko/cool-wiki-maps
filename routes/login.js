"use strict";

const express = require('express');
const router  = express.Router();
const bodyParser = require('body-parser');
const app         = express();
const CryptoCookie = require('crypto-cookie');
const crypto = require('crypto');
const randNumGen = require('../saltGen');
const hasher = require('../hasher');

app.use(bodyParser.json());



module.exports = (knex) => {

  router.post("/", (req, res) => {
    //let cookie = new CryptoCookie(req, res);
    let body = req.body;
    //console.log(body);
    knex
      .select("*")
      .from("users")
      .where({
        username: body.username
    })
    .then((results) => {
      //console.log(hasher(body.password))
      if (results[0].password !== hasher(body.password)) {
        console.log("Verification failed! D=")
        throw err;
      } else {
        return results;
      }
    })
    .then((results) => {
      let randID = randNumGen(36);
      let user = results[0]
      console.log(randID);
      knex('users').where({uid: user.uid})
      .update({session_id: randID})
      .then((count) =>{
        console.log("Updated ", count, " sessionID");
        res.cookie('sessionID', randID)
        res.cookie('username', user.username)
        res.redirect('/')
      })
      .catch((error) => {
        console.log("Error updating sessionID", error)
        res.render("oops", {errorMessage: error})
      })
    })
    .catch((error) => {
      console.log(error)
      res.render("oops", {errorMessage: error})
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