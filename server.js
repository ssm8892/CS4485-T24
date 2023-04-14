/*const express = require('express');
const mysql = require('mysql2/promise');

// Create a MySQL pool
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "password",
    database: "online_tutoring"
});

// Create an Express app
const app = express();

// List all tutors
app.get('/tutors', (req, res) => {
    pool.query('SELECT * FROM tutors')
        .then(([rows]) => {
            res.json(rows);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'Error getting tutors' });
        });
});

// Show information about one specific tutor
app.get('/tutors/:id', (req, res) => {
    const { id } = req.params;
    pool.query('SELECT * FROM tutors WHERE id = ?', [id])
        .then(([rows]) => {
            if (rows.length > 0) {
                res.json(rows[0]);
            } else {
                res.status(404).json({ error: 'Tutor not found' });
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'Error getting tutor' });
        });
});

// Show "signup to be a tutor" page
app.get('/tutors/new', (req, res) => {
    // Render the signup form
    res.render('tutor_signup_form');
});

// Create new tutor account
app.post('/tutors', (req, res) => {
    const { name, email, subjects } = req.body;
    pool.query('INSERT INTO tutors (name, email, subjects) VALUES (?, ?, ?)', [name, email, subjects])
        .then(() => {
            res.status(201).json({ message: 'Tutor created' });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'Error creating tutor' });
        });
});

// List all reservations
app.get('/reservations', (req, res) => {
    pool.query('SELECT * FROM reservations')
        .then(([rows]) => {
            res.json(rows);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'Error getting reservations' });
        });
});

// Show information about one specific reservation
app.get('/reservations/:id', (req, res) => {
    const { id } = req.params;
    pool.query('SELECT * FROM reservations WHERE id = ?', [id])
        .then(([rows]) => {
            if (rows.length > 0) {
                res.json(rows[0]);
            } else {
                res.status(404).json({ error: 'Reservation not found' });
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'Error getting reservation' });
        });
});

// Show new reservation form
app.get('/reservations/new', (req, res) => {
    // Render the reservation form
    res.render('reservation_form');
});

// Create new reservation
app.post('/reservations', (req, res) => {
    const { tutor_id, student_name, date, time } = req.body;
    pool.query('INSERT INTO reservations (tutor_id, student_name, date, time) VALUES (?, ?, ?, ?)', [tutor_id, student_name, date, time])
        .then(() => {
            res.status(201).json({ message: 'Reservation created' });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'Error creating reservation' });
        });
});

//app.listen(PORT, () => console.log(`Listening on ${PORT}`));
// Query the database
pool.query('SELECT * FROM tutor')
  .then(([rows]) => {
    // Do something with the rows
    console.log(rows);
  })
  .catch((err) => {
    // Handle errors
    console.error(err);
  });


  function generateTutorDivs() {
    fetch('/tutors')
      .then(response => response.json())
      .then(tutors => {
        const tutorContainer = document.querySelector('#tutor-container');
        for (const tutor of tutors) {
          const tutorDiv = document.createElement('div');
          tutorDiv.classList.add('tutor');
          tutorDiv.dataset.id = tutor.id;
          tutorDiv.innerHTML = `
            <h2>${tutor.name}</h2>
            <p>${tutor.description}</p>
            <button class="book-appointment">Book Appointment</button>
          `;
          tutorContainer.appendChild(tutorDiv);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
*/

const express = require("express");
const cors = require("cors");
const mysql = require('mysql');

const app = express();
const PORT = process.env.PORT || 3000;

const pool = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ONLINE_TUTORING"
});


app.use(cors());

app.options("*", (req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Acesss-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Authorization, Content-Length, X-Requested-With');
    res.send(200);
})

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${req.ip}`);
    next();
});

app.use(express.static(__dirname + "/styles"));
app.use(express.static(__dirname + "/assets"));

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

// List all tutors
app.get('/tutors', async (req, res) => {
    try {
        // Query the database for all tutors
        const [rows] = await pool.query('SELECT * FROM tutors');
        // Return the list of tutors as JSON
        res.json(rows);
    } catch (err) {
        // Return an error response if something goes wrong
        res.status(500).json({ error: 'An error occurred while retrieving the tutors' });
    }
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

app.listen(PORT, () => console.log(`Listening on ${PORT}`));