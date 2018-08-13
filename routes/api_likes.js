"use strict";

const express = require('express');
const router = express.Router();

module.exports = (knex) => {

  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("likes")
      .then((likes) => {
        res.json(likes);
      });
  });

  router.get("/resources/user", (req, res) => {

    const resIds = [];
    for (let resId in req.query){
      resIds.push(req.query[resId]);
    }

    knex
      .select("*")
      .from("likes")
      .whereIn("resource_id", resIds )
      .andWhere("user_id", 1)
      .then((likes) => {
        res.json(likes);
      })
  })

  router.get("/resources", (req, res) => {

    const resIds = [];
    for (let resId in req.query){
      resIds.push(req.query[resId]);
    }

    knex
      .select("*")
      .from("likes")
      .whereIn("resource_id", resIds )
      .then((likes) => {
        res.json(likes);
      })
  })

  return router;

}
