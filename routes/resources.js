"use strict";

const express = require("express");
const router  = express.Router();
const request = require('request');
const moment = require("moment");
const utility = require('../public/scripts/utility.js');
const user_id = 1;
const urlPreviewKey = '5b390f942f6c14c92f9c98f8a02705400ceddbf88a7d3';

module.exports = (knex) => {

  router.get("/search", (req, res) => {
    const query = req.query.queryStr;
    knex
      .select("*")
      .from("resources")
      .where("title", "like", `%${query}%`)
      .orWhere("description", "like", `%${query}%`)
      .orWhere("url", "like", `%${query}%`)
      .then((resources) => {
        res.render("index", {
          resources: resources,
        })
      })
  })

  router.get("/:resourceid/comments", (req, res) => {
    const resource_id = req.params.resourceid;
    const userIds = [];
    knex
      .select("*")
      .from("resources")
      .where("resource_id", resource_id )
      .then((resources) => {
        knex
          .select("*")
          .from("comments")
          .where("resource_id", resource_id )
          .then((comments) => {
            for (let comment of comments){
              userIds.push(comment.user_id);
            }
            knex
              .select("*")
              .from("users")
              .whereIn("id", userIds)
              .then((users)=> {
                let commentsObj = utility.createCommentsObj(users, comments);
                return res.render("comments", {commentsObj, resources});
              })
          });
        });
      });



  router.get("/:resourceid/likes", (req, res) => {
    const resource_id = req.params.resourceid;
    knex
      .count("like_id")
      .from("likes")
      .where("resource_id", resource_id )
      .then((results) => {
        res.json(results);
       // res.render("index", {resources: results})
    });
  });

  router.get("/:resourceid/categories", (req, res) => {
    const resource_id = req.params.resourceid;
    knex
      .select("category_id")
      .from("categories_resources")
      .where("resource_id", resource_id )
      .then((results) => {
        const catId = results[0].category_id;
        knex
        .select("category")
        .from("categories")
        .where("category_id", catId )
        .then((results2) => {
          const category = results2;
          knex
            .select("url")
            .from("resources")
            .where("resource_id", resource_id )
            .then((results3) => {
              const url = results3[0];
              res.render('tagCategory',{
                resource_id: resource_id,
                category: category,
                url: url
              })
            })
          })
      })
  });

  router.post("/new", (req, res) => {
    request(`http://api.linkpreview.net/?key=${urlPreviewKey}&q=${req.body.url}`,
      function (error, response, body) {
        const jsonResp = JSON.parse(body);
        knex("resources")
          .returning("resource_id")
          .insert({
            url: jsonResp.url,
            title: jsonResp.title,
            description: jsonResp.description,
            image_url: jsonResp.image,
            creator_id: user_id
          })
          .then(() => {
            res.redirect("/");
          })
      });
    });

  router.post("/:resource_id/categories", (req, res) => {
    const data = [];
    for(let cat of req.body.categories){
      let catRes = {
        category_id: cat,
        resource_id: req.params.resource_id
      }
      data.push(catRes);
    }

    knex("categories_resources")
    .insert(data)
    .then(res.redirect('/'));

  });

  router.post("/:resource_id/comments", (req, res) => {

    const now = moment().format('YYYY MM DD');
    knex("comments")
    .insert({
      comment_text: req.body.comment_text,
      created_on: now,
      updated_on: now,
      resource_id: req.params.resource_id,
      user_id: user_id
    })
    .then(res.redirect(`/resources/${req.params.resource_id}/comments`));

  });

  router.post("/:resourceid/likes", (req, res) => {

    const resId = req.params.resourceid;
    const now = moment().format("YYYY MM DD");

    //If a like exists then delete it , else add a new one.
    knex
      .select("*")
      .from("likes")
      .where({
        user_id: user_id,
        resource_id: resId
      }).then((results)=>{
        if (results.length === 0){
          knex("likes")
            .insert({
              resource_id: resId,
              user_id: user_id,
              created_on: now
            }).then((insert)=>{});
        }else{
          knex("likes")
            .where({
              resource_id: resId,
              user_id: user_id
            }).del().then((count) => {});
        }
      });
  });

  router.post("/:resourceid/rating", (req, res) => {
    const resource_id = req.params.resourceid;
    const newRating = req.body.rating;
    const user_id = 1;
    const now = moment().format("YYYY MM DD");

    knex
      .select("*")
      .from("ratings")
      .where({
        resource_id: resource_id,
        user_id: user_id
      }).then((ratings) => {
        if (ratings.length !== 0){
          ratings[0].rating_id;
          knex('ratings')
            .where({rating_id: ratings[0].rating_id})
            .update({
              rating: newRating,
              updated_on: now
            }).then((res)=>{
              return res;
            });
        }else{
          knex('ratings')
            .insert({
              resource_id: resource_id,
              user_id: user_id,
              rating: newRating,
              created_on: now
            }).then((res)=>{
              return res;
            });
        }
      })
 });

  return router;
}
