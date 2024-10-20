const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");
const fs = require('fs');
const bcrypt = require('bcrypt');
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

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const img_pf = req.file
    ? `https://foodcipesback.up.railway.app/profile_images/${req.file.filename}`
    : isValidUrl(req.body.img_pf)
    ? req.body.img_pf
    : null;

  const sql = "select img_pf from user where user_id = ?";
  connection.query(sql, [userID],(err,results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    try {
      if (img_pf != results[0].img_pf) {
        const imgP = path.basename(results[0].img_pf);
        const imagePath = path.join(img_user, imgP);
        deleteImage(imagePath);
      }
    } catch (error) {}
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

// router.post("/login", (req, res) => {
//   const { email, password } = req.body;

//   const sql = "select * from user where email = ? and password = ? and status_user = 1";
//   connection.query(sql, [email, password], (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     res.send(results);
//   });
// });

router.get("/up/status_user/:userID/:statusID", (req,res) => {
  const userID = req.params.userID;
  const statusID = req.params.statusID;

  const sql = "update user set status_user = ? where user_id = ?";
  connection.query(sql,[statusID,userID],(err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM user WHERE email = ? and status_user = 1";
  connection.query(sql, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const isMatch = await bcrypt.compare(password, results[0].password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email หรือรหัสผ่านไม่ถูกต้อง' });
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

router.post("/add/user", upload.single("img_pf"), async (req, res) => {
  const { name, email, password } = req.body;
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const img_pf = req.file
    ? `https://foodcipesback.up.railway.app/profile_images/${req.file.filename}`
    : null;
  const sql =
    "insert into user(name , email , password , img_pf , type_user , status_user , sum_report) values(?,?,?,?,1,1,0)";
  connection.query(sql, [name, email, hashedPassword, img_pf], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({
      msg: "Data inserted successfully",
      inserted: results.insertId,
    });
  });
});

router.post('/forgot',(req,res) => {
  const { email } = req.body;

  const sql = 'select * from user where email = ?';
  connection.query(sql,[email],(err,results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.send(results);
  })
})

// router.post('/repassword/:userID',(req,res) => {
//   const userID = req.params.userID;
//   const { password } = req.body;

//   const sql = 'update user set password = ? where user_id = ? '
//   connection.query(sql,[password,userID],(err,results) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     res.send(results);
//   })
// })

router.post('/repassword/:userID',async (req,res) => {
  const userID = req.params.userID;
  const { password } = req.body;

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const sql = 'update user set password = ? where user_id = ? '
  connection.query(sql,[hashedPassword,userID],(err,results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.send(results);
  })
})

module.exports = router;
