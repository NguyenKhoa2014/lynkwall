"use strict";

const express = require('express');
const router = express.Router();

module.exports = (knex) => {

  // Get all users
  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("users")
      .then((results) => {
        res.json(results);
      });
  });

  // Get all resources created by a user
  router.get("/:userid/resources", (req, res) => {    
    const userid = req.params.userid;
    const userLikes = [];
    knex
      .select("*")
      .from("likes")
      .where('user_id', 1)
      .then((likes) => {
        for (let like of likes){
          userLikes.push(like.resource_id);
        }
        knex
          .select("*")
          .from("resources")
          .where("creator_id", userid)
          .orWhereIn("resource_id", userLikes)
          .then((resources) => {
            knex
              .select("*")
              .from("categories")
              .then((categories) => {
                res.render("index", {
                   resources: resources,
                   categories: categories
                });
          }).catch((err) => {
            console.log(err)
          })
        })
      });
  });

  // Get all likes for a user
  router.get("/:userid/likes", (req, res) => {
    const userid = req.params.userid;
    knex
      .select("*")
      .from("likes")
      .where("user_id", userid)
      .then((results) => {
        res.json(results);
      }).catch((err) => {
        console.log(err)
      })
  })

  // Create new resource
  router.post("/new", (req, res) => {
    const name = req.body.name;
    knex ('resources')
      .insert({name: name})
      .then(results => {
      return res.redirect('/');
    })
  })

  return router;
}
