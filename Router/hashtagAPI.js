const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

const connection = mysql.createPool({
  host: "191.101.230.103",
  user: "u528477660_foodcipe",
  password: "B7Ar3G9L",
  database: "u528477660_foodcipe",
});

router.get("/see/hashtag", (req, res) => {
    const sql = "SELECT * FROM hashtag";
    connection.query(sql, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.send(results);
    });
  });

router.get("/see/hashtag/:postID", (req,res) => {
  const postID = req.params.postID;

  const sql = "select name from hashtag where post_id = ?";
  connection.query(sql,[postID] ,(err,results) => {
    if (err) {
      return res.status(500).json({ err: err.message });
    }
    res.send(results);
  })
})

router.get("/see/hashtag_auto", (req,res) => {
    const sql = "SELECT DISTINCT name FROM `hashtag` ORDER BY name";
    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.send(results);
    })
})

module.exports = router;