const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

const connection = mysql.createPool({
  host: "191.101.230.103",
  user: "u528477660_foodcipe",
  password: "B7Ar3G9L",
  database: "u528477660_foodcipe",
});

router.get("/see/like", (req, res) => {
  const sql = "SELECT * FROM `like`";
  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.send(results);
  });
});

router.get("/see/like_user/:userID", (req, res) => {
  const userID = req.params.userID;

  const sql = "SELECT * FROM `like` where user_id = ?";
  connection.query(sql, [userID], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.send(results);
  });
});

router.get("/see/like_detail/:userID/:postID", (req, res) => {
  const userID = req.params.userID;
  const postID = req.params.postID;

  const sql = "SELECT * FROM `like` where user_id = ? and post_id = ?";
  connection.query(sql, [userID,postID], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.send(results);
  });
});

router.post("/add/like", (req, res) => {
  const { user_id, post_id } = req.body;
  const sql = "insert into `like`( user_id, post_id) values(?,?)";
  connection.query(sql, [user_id, post_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({
      msg: "Data inserted successfully",
      inserted: results.insertId,
    });
  });
});

router.post("/delete/like", (req, res) => {
  const { user_id, post_id } = req.body;
  const sql = "delete from `like` where user_id = ? and post_id = ?";
  connection.query(sql, [user_id, post_id], (err, results) => {
    if (err) {
      return res.status(500).json({ err: err.message });
    }
    res.json({
      msg: "Data delete successfully",
      deleted: results.deleted,
    });
  });
});

module.exports = router;
