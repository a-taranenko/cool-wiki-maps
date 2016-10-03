"use strict";

const express = require('express');
const router  = express.Router();
const bodyParser  = require("body-parser");
const app         = express();
app.use(bodyParser.urlencoded({ extended: true, type: "*/*" }));



module.exports = (knex) => {

// let logInStatus = undefined;

// function sessionCheck(req, cb) {
// let sessionID = req.cookies.sessionID
// knex.raw('SELECT EXISTS(SELECT 1 FROM users WHERE session_id=?;)', sessionID)
//   .then((response) => {
//     console.log("Page requested by LOGGED IN user:", response.rows[0])
//     cb (null, response.rows[0])
//     next()
//   })
//   .catch((error) => {
//     console.log("Auth error:", error)
//     cb (null, false)
//     next()
//   })
// }

// app.use(function(req, res, next) {
//  sessionCheck(req, (err, loggedin)=> {
//   logInStatus = loggedin
//   console.log("log in status: ", logInStatus)
//   next()
//  })
// })

  router.get("/:cid", (req, res) => {
    knex
      .select("marker")
      .from("markers")
      .where('cid', req.params.cid)
      .then((results) => {
        res.json(results);
    });
  });
  // if (logInStatus) {

  router.get("/user/:username", (req, res) => {
    knex('users')
      .leftJoin('collections', 'users.uid', '=', 'collections.owner_id')
      .select('collections.*')
      .where('users.username', req.params.username)
      .then((results) => {
            console.log(results)
            res.locals.allMaps = results;
            let templateVars = { maps: res.locals.allMaps, username: req.cookies.username, uid: res.locals.uid};
            res.render("my_maps", templateVars)
          })
  });


  router.post("/addcollection", (req, res) => {
    let body = req.body;
    let cid = Math.floor(Math.random()*10e5)
    console.log("Add Collection!")
    console.log(body)
    let stickItInThere = {
      id: undefined,
      owner_id: body.uid,
      cid: cid,
      collection_name: body.name,
      desc: body.desc
    }
    knex('collections').insert([stickItInThere], 'id')
    .then((count) => {
      console.log("added collection #", count)})
      res.redirect('/view_map/' + cid)
      //res.render('index', {username: req.cookies.username, login: req.wikimap.login, cid: cid})
    .catch((error) => {
      res.render("oops", {errorMessage: error})
    })
  })

  router.post("/addmarker/:cid", (req, res) => {
    let body = JSON.stringify(req.body);
    console.log("Add Marker!")
    console.log(body)
    let stickItInThere = {
      id: undefined,
      cid: req.params.cid,
      marker: body
    }
    knex('markers').insert([stickItInThere], 'id').then((count) => {console.log("added marker #", count)})
    .catch((error) => {
      res.render("oops", {errorMessage: error})
    })
  })

// } else {
//   router.post('/*', (req, res) => {
//     res.render('notLoggedIn')
//   })
//   router.get('/*', (req, res) => {
//     res.render('notLoggedIn')
//   })
// }
  // router.get("/add/:cid", (req, res) => {
  //   knex
  //     .select("marker")
  //     .from("markers")
  //     .where("cid", 1)
  //     .then((results) => {
  //       res.json(results);
  //     });
  // });

  return router;
}
