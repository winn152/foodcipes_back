const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

const connection = mysql.createPool({
    host: "191.101.230.103",
    user: "u528477660_foodcipe",
    password: "B7Ar3G9L",
    database: "u528477660_foodcipe",
  });

  router.get("/see/comment", (req, res) => {
    const sql = "SELECT * FROM comment";
    connection.query(sql, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.send(results);
    });
  });

  router.post("/add/comment", (req, res) => {
    const { post_id, user_id, text } = req.body;
    
    const sql = "insert into comment( post_id, user_id,text) values(?,?,?)";
    connection.query(sql, [post_id, user_id, text], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        msg: "Data inserted successfully",
        inserted: results.insertId,
      });
    });
  });

  router.get("/see/comment_post/:postID", (req, res) => {
    const postID = req.params.postID;

    const sql = "SELECT user.img_pf,user.name,comment.text FROM user join comment on user.user_id = comment.user_id where comment.post_id = ?";

    connection.query(sql,[postID], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.send(results);
    });
  });

  module.exports = router;