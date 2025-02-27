const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

//เชื่อมต่อฐานข้อมูล
const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"1234",
    database:"classicmodels"
});

db.connect((err) => {
    if (err) {
      console.error("Connection Failed: " + err.message);
    } else {
      console.log("Connected to MySQL database.");
    }
  });

// เพิ่มนักเรียน
app.post("/students", (req, res) => {
    const { first_name, last_name, age, email } = req.body;
    const sql = "INSERT INTO students (first_name, last_name, age, email) VALUES (?, ?, ?, ?)";
    db.query(sql, [first_name, last_name, age, email], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Student added successfully", studentId: result.insertId });
    });
  });

// ค้นหานักเรียนตามชื่อหรือนามสกุล
app.get("/students/search", (req, res) => {
    const { name } = req.query;
    const sql = "SELECT * FROM students WHERE first_name LIKE ? OR last_name LIKE ?";
    db.query(sql, [`%${name}%`, `%${name}%`], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });

// ดึงข้อมูลนักเรียนทั้งหมด
app.get("/students", (req, res) => {
    db.query("SELECT * FROM students", (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });

// เริ่มต้นเซิร์ฟเวอร์
app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });