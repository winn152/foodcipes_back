const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");
const fs = require('fs');
const img_user = path.join(__dirname, "../Cloud/Image_Profile");

const connection = mysql.createPool({
  host: "191.101.230.103",
  user: "u528477660_foodcipe",
  password: "B7Ar3G9L",
  database: "u528477660_foodcipe",
});

const deleteImage = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting the file:', err);
      return;
    }
    console.log('File deleted successfully');
  });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, img_user); // โฟลเดอร์ที่เก็บไฟล์
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // ตั้งชื่อไฟล์ใหม่
  },
});

const upload = multer({ storage });

router.post("/up/user/:userID", upload.single("img_pf"),(req, res) => {
  const { name } = req.body;
  const userID = req.params.userID;
  const img_pf = req.file
    ? `https://foodcipes-back.onrender.com/profile_images/${req.file.filename}`
    : null;

  const sql = "select img_pf from user where user_id = ?";
  connection.query(sql, [userID],(err,results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const imgP = path.basename(results[0].img_pf);
    const imagePath = path.join(img_user, imgP);
    deleteImage(imagePath);
    const sql2 = "UPDATE user SET name = ? , img_pf = ? WHERE user_id = ?";
    connection.query(sql2,[name,img_pf,userID],(err,results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        msg: "Data update successfully",
        inserted: results.insertId,
      });
    })
  })
});

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
    ? `https://foodcipes-back.onrender.com/profile_images/${req.file.filename}`
    : null;
  const sql =
    "insert into user(name , email , password , img_pf , type_user , status_user , sum_report) values(?,?,?,?,1,1,0)";
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
