const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
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

const deleteImage = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting the file:", err);
      return;
    }
  });
};

const upload = multer({ storage: storage });

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

  const sql = "select user.name as username,user.img_pf,post.*,count(`like`.like_id) as sumlike from user join post on user.user_id = post.user_id left join `like` on `like`.post_id = post.post_id where user.user_id != ? and post.status_post = 1 group by user.name, user.img_pf,post.post_id order by post.date_post desc";
  connection.query(sql, [userID], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.send(results);
  });
});

router.get("/see/post_following/:userID", (req, res) => {
  const userID = req.params.userID;

  const sql = "SELECT user.name AS username, user.img_pf, post.*,COUNT(`like`.like_id) as sumlike FROM follow JOIN user ON follow.fuser_id = user.user_id LEFT JOIN post ON post.user_id = follow.fuser_id LEFT JOIN `like` on `like`.post_id = post.post_id  WHERE follow.user_id = ? and post.status_post = 1 group by user.name, user.img_pf,post.post_id";
  connection.query(sql, [userID], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.send(results);
  });
});

router.get("/see/member_profile/:userID", (req, res) => {
  const userID = req.params.userID;

  const sql = "select user.name as username,user.img_pf,user.sum_report as sum_report,user.sum_report,user.status_user as status_user,post.*,count(`like`.like_id) as sumlike from user join post on user.user_id = post.user_id left join `like` on `like`.post_id = post.post_id where post.status_post = 1 and user.user_id = ? group by user.name, user.img_pf,post.post_id";
  connection.query(sql, [userID], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.send(results);
  });
});

router.get("/see/post_detail/:postID", (req, res) => {
  const postID = req.params.postID;

  const sql = "select user.name as username,user.img_pf,post.*,count(`like`.like_id) as sumlike from user join post on user.user_id = post.user_id left join `like` on `like`.post_id = post.post_id where post.post_id = ? group by user.name, user.img_pf,post.post_id";
  connection.query(sql, [postID], (err, results) => {
    if (err) {
      console.error("Error executing query:", err.stack);
      res.status(500).json({ error: "Database query error" });
      return;
    }
    res.send(results);
  });
});

router.get("/see/post_edit/:postID", (req, res) => {
  const postID = req.params.postID;

  const sql = "select * from link where post_id = ?";
  connection.query(sql, [postID], (err, results) => {
    if (err) {
      console.error("Error executing query:", err.stack);
      res.status(500).json({ error: "Database query error" });
      return;
    }
    if (results == "") {
      const sql2 = "select * from post where post_id = ?";
      connection.query(sql2, [postID], (err, results) => {
        res.send(results);
      });
    } else {
      const sql3 = "select * from post,link where post.post_id = link.post_id AND post.post_id = ?";
      connection.query(sql3, [postID], (err, results) => {
        res.send(results);
      });
    }
  });
});

router.get("/see/mypost/:statusPost/:userID", (req, res) => {
  const statusPost = req.params.statusPost;
  const userID = req.params.userID;

  const sql = "select user.name as username,user.img_pf,post.* from user,post where user.user_id = post.user_id and status_post = ? and user.user_id = ?";
  connection.query(sql, [statusPost, userID], (err, results) => {
    if (err) {
      console.error("Error executing query:", err.stack);
      res.status(500).json({ error: "Database query error" });
      return;
    }
    res.send(results);
  });
});

router.post("/add/post",upload.fields([{ name: "img_main" }, { name: "linkpath" }]), (req, res) => {
    const {user_id, name, story, for_post, time_use, status_post, ingredient, step_post, type_link ,hashtag} = req.body;

    const img_main = req.files["img_main"]
      ? `https://foodcipesback.up.railway.app/post_images/${req.files["img_main"][0].filename}`
      : null;

    const linkpath = req.files["linkpath"]
      ? req.files["linkpath"].map(
          (file) => `https://foodcipesback.up.railway.app/post_images/${file.filename}`
        )
      : [];
    const sql = "insert into post( user_id, name , story , for_post , time_use , status_post , ingredient , step_post , date_post ,img_main) values(?,?,?,?,?,?,?,?,?,?)";
    connection.query(
      sql,
      [user_id, name, story, for_post, time_use, status_post, ingredient, step_post, new Date(), img_main,], (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        const sql2 = "select * from post where user_id = ? order by post_id DESC limit 1";
        connection.query(sql2, [user_id], (err, results) => {
          const sql3 = "INSERT INTO `link`(`post_id`, `type_link`, `linkpath`) VALUES (?,?,?)";
          linkpath.forEach((url) => {
            connection.query(sql3,[results[0].post_id, type_link, url],(err, results) => {
                if (err) {
                  return res.status(500).json({ error: err.message });
                }
              }
            );
          });
          try {
            const sql4 = "insert into hashtag (post_id , name) values (?,?)";
            const hashtagsArray = hashtag.split(",");
            hashtagsArray.forEach((tag) => {
              connection.query(sql4,[results[0].post_id,tag],(err,results) => {
                if (err) {
                  return res.status(500).json({ error: err.message });
                }
              })
            })
          } catch (error) {}
          
        });
      }
    );
  }
);

router.post("/up/post",upload.fields([{ name: "img_main" }, { name: "linkpath" }]),(req, res) => {
    const {post_id,name,story,for_post,time_use,status_post,ingredient,step_post,type_link,hashtag } = req.body;

    const isValidUrl = (url) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    const img_main = req.files["img_main"]
      ? `https://foodcipesback.up.railway.app/post_images/${req.files["img_main"][0].filename}`
      : isValidUrl(req.body.img_main)
      ? req.body.img_main
      : null;

    const linkpath = req.files["linkpath"]
      ? req.files["linkpath"].map(
          (file) => `https://foodcipesback.up.railway.app/post_images/${file.filename}`
        )
      : req.body.linkpath
      ? Array.isArray(req.body.linkpath)
        ? req.body.linkpath.filter(isValidUrl)
        : isValidUrl(req.body.linkpath)
        ? [req.body.linkpath]
        : []
      : [];

    const checkImg_main = "select img_main from post where post_id = ?";
    connection.query(checkImg_main,[post_id],(err,results) => {
      try {
        if(results[0].img_main != img_main) {
          const imgm = path.basename(response[0].img_main);
          const imagePathm = path.join(img_post, imgm);
          deleteImage(imagePathm);
        }
      } catch (error) {}
      
      const sql = "update post set name = ? , story = ? , for_post = ? , time_use = ? , status_post = ? , ingredient = ? , step_post = ? , img_main = ? where post_id = ?";
      connection.query(sql,[name,story,for_post,time_use,status_post, ingredient,step_post,img_main, post_id], (err, results) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          const sql2 = "select linkpath from link where post_id = ?";
          connection.query(sql2, [post_id], (err, results) => {
            try {
              results.forEach((url,i) => {
                if (url.linkpath != linkpath[i]) {
                  const imgP = path.basename(url);
                  const imagePath = path.join(img_post, imgP);
                  deleteImage(imagePath);
                }
              });
            } catch (error) {}
            const sql3 = "delete from link where post_id = ?";
            connection.query(sql3, [post_id], (err, results) => {
              const sql4 ="INSERT INTO `link`(`post_id`, `type_link`, `linkpath`) VALUES (?,?,?)";
              linkpath.forEach((url) => {
                connection.query(sql4,[post_id, type_link, url],(err, results) => {
                    if (err) {
                      return res.status(500).json({ err: err.message });
                    }
                  }
                );
              });
              const sql5 = "delete from hashtag where post_id = ?";
              connection.query(sql5,[post_id],(err,results) => {
                if (err) {
                  return res.status(500).json({ err: err.message });
                }
                const sql6 = "insert into hashtag (post_id , name) values (?,?)";
                try {
                  const hashtagsArray = hashtag.split(",");
                  hashtagsArray.forEach((tag) => {
                    connection.query(sql6,[post_id,tag],(err,results) => {
                      if (err) {
                        return res.status(500).json({ error: err.message });
                      }
                    })
                  })
                } catch (error) {}
              })
            });
          });
        }
      );
    })
  }
);

router.get("/see/link/:postID", (req, res) => {
  const postID = req.params.postID;
  const sql = "SELECT type_link,linkpath FROM link where post_id = ?";
  connection.query(sql, [postID], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.send(results);
  });
});

router.get("/delete/post/:postID",(req, res) => {
  const postID = req.params.postID;
  const sql = "select img_main from post where post_id = ?";
  connection.query(sql,[postID],(err,results) => {
    try {
      const imgm = path.basename(results[0].img_main);
      const imagePathm = path.join(img_post, imgm);
      deleteImage(imagePathm);
    } catch (error) {}
    const sql2 = "select linkpath from link where post_id = ?";
    connection.query(sql2,[postID],(err,results) => {
      try {
        results.map((i) => {
          const img = path.basename(i.linkpath);
          const imagePath = path.join(img_post, img);
          deleteImage(imagePath);
        })
      } catch (error) {}
      const sql3 = "delete from post where post_id = ?";
      connection.query(sql3,[postID],(err,results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
      })
    })
  })
})

module.exports = router;
