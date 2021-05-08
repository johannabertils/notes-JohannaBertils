var express = require('express');
var router = express.Router();
const fs = require("fs");
const cors = require("cors");
const mysql = require("mysql2");

router.use(cors());

/* GET users listing. */

router.post("/new", function (req, res) {
  let text = req.body.mainText;
  let rubrik = req.body.heading;
  console.log(text);
  console.log(rubrik);
  res.json("saved");

  req.app.locals.con.connect(function (err) {
    if (err) {
      console.log(err);
    }

    let saveHeading = rubrik;
    let saveMainText = text;

    let sql = `INSERT INTO notes (heading, mainText) VALUES ("${saveHeading}", "${saveMainText}")`

    req.app.locals.con.query(sql, function (err, result) {
      if (err) {
        console.log(err);
      }
      console.log("result", result);
    })
  });
});

router.get('/data', function (req, res, next) {

  req.app.locals.con.connect(function (err) {
    if (err) {
      console.log(err);
    }

    let sql = `SELECT * FROM notes`;

    req.app.locals.con.query(sql, function (err, result) {
      if (err) {
        console.log(err);
      }
      console.log("result", result);
      res.json(result);
    })
  });
});

router.post("/check", function (req, res) {
  console.log("working");
  let docId = req.body.id;
  console.log(docId);
  let sql = `SELECT * FROM notes WHERE id=${docId}`;
  console.log(sql);

  req.app.locals.con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    }
    console.log("result", result);
    res.json(result);
  })

  router.post("/update", function (req, res) {
    let newText = req.body.updateMainText;
    let newHeading = req.body.updateHeading;
    let documentId = req.body.documentId;

    console.log("new" + newHeading);
    console.log("new" + newText);
    console.log("new" + documentId);

    let sql = `UPDATE notes SET heading= "${newHeading}", mainText= "${newText}" WHERE id="${documentId}"`;

    req.app.locals.con.query(sql, function (err, result) {
      if (err) {
        console.log(err);
      }
      console.log("result", result);
      res.json("Updated");
    })

  });

});

module.exports = router;
