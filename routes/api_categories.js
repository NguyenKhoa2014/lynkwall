"use strict";

const express = require('express');
const router = express.Router();

module.exports = (knex) => {

  // Get all users
  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("categories")
      .then((categories) => {
        res.json(categories);
      });
  });

  return router;

}
