const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");
const img_user = path.join(__dirname, "../Cloud/Image_Profile");

const connection = mysql.createPool({
  host: "191.101.230.103",
  user: "u528477660_foodcipe",
  password: "B7Ar3G9L",
  database: "u528477660_foodcipe",
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, img_user); // โฟลเดอร์ที่เก็บไฟล์
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // ตั้งชื่อไฟล์ใหม่
  },
});

const upload = multer({ storage });

//   const connection = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "0613824294za",
//     database: "project_foodcipes",
//   });

//   const connection = mysql.createConnection({
//     host: "191.101.230.103",
//     user: "u528477660_foodcipe",
//     password: "B7Ar3G9L",
//     database: "u528477660_foodcipe",
//   });

//   connection.connect((err) => {
//     if (err) {
//         console.error('ข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล:', err);
//         return;
//     }
//     console.log('เชื่อมต่อฐานข้อมูลเรียบร้อย');
// });

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  console.log(password);

  const sql = "select * from user where email = ? and password = ?";
  connection.query(sql, [email, password], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.send(results);
  });
});

router.get("/see/user", (req, res) => {
  const sql = "SELECT * FROM user";
  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.send(results);
  });
});

router.get("/see/profile/:userID", (req, res) => {
  const userID = req.params.userID;

  const sql = "select * from user where user_id = ?";
  connection.query(sql, [userID], (err, results) => {
    if (err) {
      console.error("Error executing query:", err.stack);
      res.status(500).json({ error: "Database query error" });
      return;
    }
    res.send(results);
  });
});

router.post("/add/user", upload.single("img_pf"), (req, res) => {
  const { name, email, password } = req.body;
  const img_pf = req.file
    ? `http://localhost:3000/profile_images/${req.file.filename}`
    : null;
  const sql =
    "insert into user(name , email , password , img_pf , type_user , status_user , sum_report) values(?,?,?,?,2,1,0)";
  connection.query(sql, [name, email, password, img_pf], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({
      msg: "Data inserted successfully",
      inserted: results.insertId,
    });
  });
});

module.exports = router;
