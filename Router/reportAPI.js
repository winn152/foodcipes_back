const express = require("express");
const req = require("express/lib/request");
const router = express.Router();
const mysql = require("mysql2");

const connection = mysql.createPool({
  host: "191.101.230.103",
  user: "u528477660_foodcipe",
  password: "B7Ar3G9L",
  database: "u528477660_foodcipe",
});

router.get("/see/report", (req, res) => {
  const sql = "select * from report";
  connection.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.send(result);
  });
});

router.post("/add/report", (req, res) => {
  const { user_id, post_id, type_report } = req.body;

  const sql =
    "insert into report (user_id, post_id, type_report) values(?,?,?)";
  connection.query(sql, [user_id, post_id, type_report], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const sql2 = "update post set status_post = 3 where post_id = ?";
    connection.query(sql2, [post_id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
    });
  });
});

router.get("/see/report_user", (req, res) => {
  const sql =
    "select post.post_id as post_id,user.name as username,user.img_pf as img_pf,report.type_report as type_report,post.img_main as img_main, post.name as postname, report.report_id from report join user on report.user_id = user.user_id left join post on report.post_id = post.post_id where post.status_post = 3";
  connection.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.send(result);
  });
});

router.get("/see/report_public/:postID", (req, res) => {
  const postID = req.params.postID;

  const sql = "update post set status_post = 1 where post_id = ?";
  connection.query(sql, [postID], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
  });
});

router.post("/see/report_ban", (req, res) => {
  const { post_id, user_id, report_id } = req.body;

  const sql = 'update post set status_post = 4 where post_id = ?';
  connection.query(sql,[post_id],(err,result) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      if (report_id == null) {
        const sql2 = 'insert into report(user_id,post_id,type_report) values(?,?,1)';
        connection.query(sql2,[user_id,post_id],(err,result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            const sql3 = 'select user_id from post where post_id = ?';
            connection.query(sql3,[post_id],(err,result) => {
                console.log('1');
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                console.log('3');
                const sql4 = 'update user set sum_report = sum_report + 1 where user_id = ?';
                connection.query(sql4,[result[0].user_id],(err,result) => {
                    console.log('2');
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    console.log('4');
                })
            })
        })
      }
      else {
        const sql2 = 'update report set user_id = ? where report_id = ?';
        connection.query(sql2,[user_id,report_id],(err,result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            const sql3 = 'select user_id from post where post_id = ?';
            connection.query(sql3,[post_id],(err,result) => {
                console.log('1');
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                console.log('3');
                const sql4 = 'update user set sum_report = sum_report + 1 where user_id = ?';
                connection.query(sql4,[result[0].user_id],(err,result) => {
                    console.log('2');
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    console.log('4');
                })
            })
        })
      }
  })
  if (report_id == "") {
    console.log(1);
  } else if (report_id == null) {
    console.log(2);
  } else if (report_id == undefined) {
    console.log(3);
  }
});

router.get("/see/report_user/:userID", (req, res) => {
  const userID = req.params.userID;

  const sql =
    "select user.name as username,img_pf,post.* from user join post on user.user_id = post.user_id where post.status_post = 3 and user.user_id = ?";
  connection.query(sql, [userID], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.send(result);
  });
});

router.get("/see/report_noti/:userID", (req, res) => {
  const userID = req.params.userID;

  const sql =
    "select user.name,user.img_pf,report.type_report,post.post_id from report join post on post.post_id = report.post_id left join user on report.user_id = user.user_id where post.status_post = 4 and post.user_id = ?";
  connection.query(sql, [userID], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.send(result);
  });
});

module.exports = router;
