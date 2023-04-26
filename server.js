import express from "express";
import mysql from 'mysql';
import path from 'path';
import axios from "axios";
import { fileURLToPath } from 'url';
import cheerio from "cheerio";
import fs from "fs";

/*
const express = require("express");
const mysql = require("mysql");
const axios = require("axios");
*/

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'online_tutoring'
});

// Magic for POST requests
app.use(express.urlencoded({extended:false}));

app.get('/tutor', (req, res) => {
  pool.query('SELECT * FROM tutor', (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    res.json(results);
  });
});

app.use(express.static(__dirname));
app.use(express.static(__dirname + "/assets"));
app.use(express.static(__dirname + "/js"));

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html");
})

app.get('/home', (req, res) => {
  res.sendFile(__dirname + "/home.html");
})

// Login as user (still working)
app.post('/login', async (req, res) => {
  // Email and password
  const email = req.body.user_email;
  const password = req.body.user_password;

  // Get query pertaining to email and password
  // const query = `select * from student where email = ${email} and student_password = ${password}`;
  console.log(email);
  console.log(password);
  res.sendFile(__dirname + "/index.html");
});

// Sign up as a user (still working)
app.post('/signup', async (req, res) => {
  // Info to sign up
  const first_name = req.body.firstname;
  const last_name = req.body.lastname;
  const email = req.body.email;
  const phone = req.body.phone;
  const password = req.body.password;

  console.log(first_name);
  console.log(last_name);
  console.log(email);
  console.log(phone);
  console.log(password);

  res.sendFile(__dirname + "/index.html");
});

// Become a tutor (still working)
app.post('/become-tutor', async(req, res) => {
  // Info to become a tutor
  const bio = req.body.bio;
  const subjects = req.body.subjects;
  const timings = req.body.timings;

  console.log(bio);
  console.log(subjects);
  console.log(timings);

  res.sendFile(__dirname + "/home.html");
});

// Contact us (still working)
app.post('/contact', async(req, res) => {
  // Contact form info
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const message = req.body.message;

  console.log(name);
  console.log(email);
  console.log(phone);
  console.log(message);

  res.sendFile(__dirname + "/index.html");
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

async function generateTutorDivs() {
  try {
    const response = await axios.get('http://localhost:3000/tutor');
    const data = await response.data;

    // Log the data to the console
    console.log(data);
 } catch (error) {
    console.error(error);
  }
}

//generateTutorDivs();