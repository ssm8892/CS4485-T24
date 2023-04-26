import express from "express";
import mysql from 'mysql';
import path from 'path';
import axios from "axios";
import { fileURLToPath } from 'url';

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
  password: '',
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

app.get('/settings', (req, res) => {
  res.sendFile(__dirname + "/settings.html");
})

app.get('/home', (req, res) => {
  res.sendFile(__dirname + "/home.html");
})

// Login as user
app.post('/login', async (req, res) => {
  // Email and password
  const email = req.body.user_email
  const password = req.body.user_password

  // Get query pertaining to email and password
  const query = 

  res.sendFile(__dirname + "/index.html");
});

app.get('/:word/echo', (req, res) => {
  res.json({ "echo": req.params.word })
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

generateTutorDivs();