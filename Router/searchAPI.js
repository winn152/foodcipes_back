const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

const connection = mysql.createPool({
  host: "191.101.230.103",
  user: "u528477660_foodcipe",
  password: "B7Ar3G9L",
  database: "u528477660_foodcipe",
});

router.get("/search/user", (req, res) => {
    const { text } = req.query;
    console.log(text);

    const sql = "SELECT user_id,name,img_pf FROM user where name like ? ";
    connection.query(sql,["%"+text+"%"], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.send(results);
    });
});

router.get("/search/post", (req, res) => {
    const { text } = req.query;

    const sql = "select user.name as username, user.img_pf as img_pf, post.user_id as user_id, post.post_id as post_id,post.name as postname,post.time_use as time_post,post.for_post as for_post,post.img_main from user join post on user.user_id = post.user_id where post.name like ? and post.status_post = 1";
    connection.query(sql,["%"+text+"%"], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.send(results);
    });
});

router.get("/search/hashtag", (req, res) => {
    const { text } = req.query;

    const sql = "select user.name as username, user.img_pf as img_pf, post.user_id as user_id, post.post_id as post_id,post.name as postname,post.time_use as time_post,post.for_post as for_post,post.img_main from post join hashtag on post.post_id = hashtag.post_id left join user on user.user_id = post.user_id where hashtag.name like ? and post.status_post = 1";
    connection.query(sql,["%"+text+"%"], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.send(results);
    });
});

router.get("/search/saved/:userID", (req, res) => {
  const userID = req.params.userID;
  const { text } = req.query;

  const sql = "select user.name as username, user.img_pf as img_pf, post.* from saved_post join post on post.post_id = saved_post.post_id left join user on post.user_id = user.user_id where post.name like ? and saved_post.user_id = ? and post.status_post = 1";
  connection.query(sql,["%"+text+"%",userID], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.send(results);
  });
});

router.get("/search/mypost/:statusPost/:userID", (req, res) => {
  const statusPost = req.params.statusPost;
  const userID = req.params.userID;
  const { text } = req.query;

  const sql = "select user.img_pf, user.name as username, post.* from user join post on user.user_id = post.user_id where post.name like ? and post.status_post = ? and user.user_id = ?";
  connection.query(sql,["%"+text+"%",statusPost,userID], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.send(results);
  });
});

module.exports = router;