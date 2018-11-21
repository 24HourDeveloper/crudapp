const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const handlebars = require("express-handlebars");

const connection = mysql.createPool({
  connectionLimit: 20,
  host: "us-cdbr-iron-east-01.cleardb.net",
  user: "b63a147029ca38",
  password: "12bc8513",
  database: "heroku_347ed904ce4f7b3"
});

const app = express();

app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//getting users from database
app.get("/", (req, res) => {
  const sql = `SELECT * FROM Persons`;
  connection.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.json(results);
  });
});

app.get("/adduser", (req, res) => {
  res.render("form");
});

//Inserting user into database
app.post("/useradded", (req, res) => {
  const first = req.body.name1;
  const last = req.body.name2;
  const sql = `INSERT INTO Persons (first_name, last_name) VALUES( ?, ?)`;
  connection.query(sql, [first, last], (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send("User added");
  });
});

app.get("/updateuser", (req, res) => {
  const sql = `SELECT * FROM Persons`;
  connection.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.render("updateform", { fname: results });
  });
});

//Update user
app.post("/userupdated", (req, res) => {
  const id = req.body.id;
  const fname = req.body.name1;
  const sql = `UPDATE Persons SET first_name = '${fname}'  WHERE id = ${id}`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("User Updated");
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server started on port " + port);
});
