const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

const connection = mysql.createPool({
  host: "191.101.230.103",
  user: "u528477660_foodcipe",
  password: "B7Ar3G9L",
  database: "u528477660_foodcipe",
});

router.get("/see/savedpost", (req, res) => {
  const sql = "SELECT * FROM saved_post";
  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.send(results);
  });
});

router.get("/see/savedpost/:userID", (req, res) => {
  const userID = req.params.userID;

  const sql = "SELECT * FROM saved_post where user_id = ?";
  connection.query(sql, [userID], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.send(results);
  });
});

router.get("/see/savedpost_detail/:userID/:postID", (req, res) => {
  const userID = req.params.userID;
  const postID = req.params.postID;

  const sql = "SELECT * FROM saved_post where user_id = ? and post_id = ?";
  connection.query(sql, [userID,postID], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.send(results);
  });
});

router.post("/add/savedpost", (req, res) => {
  const { user_id, post_id } = req.body;
  const sql = "insert into saved_post( user_id, post_id) values(?,?)";
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

router.post("/delete/savedpost", (req, res) => {
  const { user_id, post_id } = req.body;
  const sql = "delete from saved_post where user_id = ? and post_id = ?";
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

router.get("/see/saved_post/:userID", (req, res) => {
  const userID = req.params.userID;

  const sql =
    "select user.name as username,user.img_pf,post.*,count(`like`.like_id) as sumlike from user join post on user.user_id = post.user_id left join `like` on `like`.post_id = post.post_id LEFT JOIN saved_post ON saved_post.post_id = post.post_id where saved_post.user_id = ? and post.status_post = 1 group by user.name, user.img_pf,post.post_id";
  connection.query(sql, [userID], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.send(results);
  });
});

module.exports = router;
