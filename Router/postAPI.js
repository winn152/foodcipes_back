const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");
const img_post = path.join(__dirname, "../Cloud/image_Post");

const connection = mysql.createPool({
  host: "191.101.230.103",
  user: "u528477660_foodcipe",
  password: "B7Ar3G9L",
  database: "u528477660_foodcipe",
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, img_post); // โฟลเดอร์ที่เก็บไฟล์
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // ตั้งชื่อไฟล์ใหม่
  },
});

const upload = multer({ storage });

router.get("/see/post", (req, res) => {
  const sql = "SELECT * FROM post";
  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.send(results);
  });
});

router.get("/see/post_profile/:userID", (req, res) => {
  const userID = req.params.userID;

  const sql =
    "select user.name as username,user.img_pf,post.*,count(`like`.like_id) as sumlike from user join post on user.user_id = post.user_id left join `like` on `like`.post_id = post.post_id where user.user_id != ? and post.status_post = 1 group by user.name, user.img_pf,post.post_id";
  connection.query(sql, [userID], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.send(results);
  });
});

router.get("/see/post_following/:userID", (req, res) => {
  const userID = req.params.userID;

  const sql =
    "SELECT user.name AS username, user.img_pf, post.*,COUNT(`like`.like_id) as sumlike FROM follow JOIN user ON follow.fuser_id = user.user_id LEFT JOIN post ON post.user_id = follow.fuser_id LEFT JOIN `like` on `like`.post_id = post.post_id  WHERE follow.user_id = ? and post.status_post = 1 group by user.name, user.img_pf,post.post_id";
  connection.query(sql, [userID], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.send(results);
  });
});

router.get("/see/member_profile/:userID", (req, res) => {
  const userID = req.params.userID;

  const sql =
    "select user.name as username,user.img_pf,post.*,count(`like`.like_id) as sumlike from user join post on user.user_id = post.user_id left join `like` on `like`.post_id = post.post_id where user.user_id = ? group by user.name, user.img_pf,post.post_id";
  connection.query(sql, [userID], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.send(results);
  });
});

router.get("/see/post_detail/:postID", (req, res) => {
  const postID = req.params.postID;

  const sql =
    "select user.name as username,user.img_pf,post.*,count(`like`.like_id) as sumlike from user join post on user.user_id = post.user_id left join `like` on `like`.post_id = post.post_id where post.post_id = ? group by user.name, user.img_pf,post.post_id";
  connection.query(sql, [postID], (err, results) => {
    if (err) {
      console.error("Error executing query:", err.stack);
      res.status(500).json({ error: "Database query error" });
      return;
    }
    res.send(results);
  });
});

router.get("/see/mypost/:statusPost/:userID", (req, res) => {
  const statusPost = req.params.statusPost;
  const userID = req.params.userID;

  const sql =
    "select user.name as username,user.img_pf,post.* from user,post where user.user_id = post.user_id and status_post = ? and user.user_id = ?";
  connection.query(sql, [statusPost, userID], (err, results) => {
    if (err) {
      console.error("Error executing query:", err.stack);
      res.status(500).json({ error: "Database query error" });
      return;
    }
    res.send(results);
  });
});

router.post("/add/post", upload.single("img_main"), (req, res) => {
  const {
    user_id,
    name,
    story,
    for_post,
    time_use,
    status_post,
    ingredient,
    step_post,
  } = req.body;
  const img_main = req.file
    ? `https://foodcipes-back.onrender.com/post_images/${req.file.filename}`:null
  const sql =
    "insert into post( user_id, name , story , for_post , time_use , status_post , ingredient , step_post , date_post ,img_main) values(?,?,?,?,?,?,?,?,?,?)";
  connection.query(
    sql,
    [
      user_id,
      name,
      story,
      for_post,
      time_use,
      status_post,
      ingredient,
      step_post,
      new Date(),
      img_main,
    ],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        msg: "Data inserted successfully",
        inserted: results.insertId,
      });
    }
  );
});

module.exports = router;
