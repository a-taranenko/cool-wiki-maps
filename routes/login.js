"use strict";

const express      = require('express');
const router       = express.Router();
const bodyParser   = require('body-parser');
const app          = express();
const cookieparser = require('cookie-parser')
const crypto       = require('crypto');
const randNumGen   = require('../saltGen');
const hasher       = require('../hasher');

app.use(bodyParser.json());



module.exports = (knex) => {

  router.post("/", (req, res) => {
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

  router.post("/register", (req, res) => {
    let body = req.body;
    let uid = Math.floor(Math.random()*10e5);
    let newPassword = hasher(body.password)
    let newUserData = {
      id: undefined,
      name: body.name,
      username: body.username,
      password: newPassword,
      email: body.email,
      uid: uid,
    }

    knex('users')
    .insert([newUserData], 'id')
    .then((results) => {
      let randID = randNumGen(36);
      let user = results[0]
      console.log(uid);
      knex('users').where({uid: uid})
      .update({session_id: randID})
      .then((count) =>{
        console.log("Inserted", count, " sessionID");
        res.cookie('sessionID', randID)
        res.cookie('username', body.username)
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
  })

  router.get("/logout", (req, res) => {
    res.clearCookie('sessionID');
    res.clearCookie('username');
    res.redirect('/');
  })

  return router;
}