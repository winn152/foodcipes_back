const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

const connection = mysql.createPool({
  host: "191.101.230.103",
  user: "u528477660_foodcipe",
  password: "B7Ar3G9L",
  database: "u528477660_foodcipe",
});

router.get("/see/follow", (req, res) => {
  const sql = "SELECT * FROM follow";
  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.send(results);
  });
});

router.get("/see/follow/:userID", (req, res) => {
  const userID = req.params.userID;

  const sql = "SELECT * FROM follow where user_id = ?";
  connection.query(sql, [userID], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.send(results);
  });
});

router.post("/add/follow", (req, res) => {
  const { user_id, fuser_id } = req.body;
  const sql = "insert into follow( user_id, fuser_id) values(?,?)";
  connection.query(sql, [user_id, fuser_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({
      msg: "Data inserted successfully",
      inserted: results.insertId,
    });
  });
});

router.post("/delete/follow", (req, res) => {
  const { user_id, fuser_id } = req.body;
  const sql = "delete from follow where user_id = ? and fuser_id = ?";
  connection.query(sql, [user_id, fuser_id], (err, results) => {
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