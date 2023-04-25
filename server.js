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
  password: 'password',
  database: 'online_tutoring'
});

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

app.get('/:word/echo', (req, res) => {
  res.json({ "echo": req.params.word })
});

app.all('*', (req, res) => {
  res.send("Invalid route");
})

//Show information about all tutors
app.get('/tutors', (req, res) => {
  pool.query('SELECT * FROM tutor', (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    res.json(results);
    console.log(res);
  });
});

// Show information about one specific tutor
app.get('/tutors/:id', async (req, res) => {
    try {
        // Extract the tutor ID from the request parameters
        const tutorId = req.params.id;
        // Query the database for the tutor with the given ID
        const [rows] = await pool.query('SELECT * FROM tutors WHERE id = ?', [tutorId]);
        // Return the tutor information as JSON
        res.json(rows[0]);
    } catch (err) {
        // Return an error response if something goes wrong
        res.status(500).json({ error: 'An error occurred while retrieving the tutor' });
    }
});


// Show "signup to be a tutor" page
app.get('/tutors/new', (req, res) => {
    // Return the HTML page for signing up to be a tutor
    res.send('<html><body><h1>Sign up to be a tutor</h1></body></html>');
});

// Create new tutor account
app.post('/tutors', async (req, res) => {
    try {
        // Extract the tutor information from the request body
        const { name, subject } = req.body;

        // Insert the new tutor into the database
        const [result] = await pool.query('INSERT INTO tutors (name, subject) VALUES (?, ?)', [name, subject]);

        // Return a JSON response indicating success
        res.json({ message: 'Tutor account created successfully', tutorId: result.insertId });
    } catch (err) {
        // Return an error response if something goes wrong
        res.status(500).json({ error: 'An error occurred while creating the tutor account' });
    }
});

// Lists all the reservations
app.get('/reservations', async (req, res) => {
    try {
        // Retrieve list of reservations from the database
        const [rows] = await pool.query('SELECT * FROM reservations');
        const reservations = rows.map(row => ({
            id: row.id,
            tutor: row.tutor,
            student: row.student,
            datetime: row.datetime.toISOString()
        }));

        // Return the list of reservations as a JSON response
        res.json(reservations);
    } catch (err) {
        // Return an error response if something goes wrong
        res.status(500).json({ error: 'An error occurred while retrieving reservations' });
    }
});

// Show information about one specific reservation
app.get('/reservations/:id', async (req, res) => {
    try {
        // Retrieve the reservation with the given id from the database
        const reservationId = req.params.id;
        const [rows] = await pool.query('SELECT * FROM reservations WHERE id = ?', [reservationId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        const row = rows[0];
        const reservation = {
            id: row.id,
            tutor: row.tutor,
            student: row.student,
            datetime: row.datetime.toISOString()
        };

        // Return the reservation information as a JSON response
        res.json(reservation);
    } catch (err) {
        // Return an error response if something goes wrong
        res.status(500).json({ error: 'An error occurred while retrieving the reservation' });
    }
});

// Show new reservation form
app.get('/reservations/new', (req, res) => {
    // Return the HTML form for creating a new reservation
    res.send('<html><body><h1>Create new reservation</h1></body></html>');
});

// Create new reservation
app.post('/reservations', async (req, res) => {
    try {
        // Extract the reservation information from the request body
        const { tutorId, studentName, datetime } = req.body;

        // Insert the new reservation into the database
        const [result] = await pool.query('INSERT INTO reservations (tutor_id, student_name, datetime) VALUES (?, ?, ?)', [tutorId, studentName, datetime]);

        // Return a JSON response indicating success
        res.json({ message: 'Reservation created successfully', reservationId: result.insertId });
    } catch (err) {
        // Return an error response if something goes wrong
        res.status(500).json({ error: 'An error occurred while creating the reservation' });
    }
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