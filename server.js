const express = require("express");
const cors = require("cors");
const mysql = require('mysql');

const app = express();
const PORT = process.env.PORT || 3000;

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'your_mysql_database',
    connectionLimit: 10
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

app.use(express.static(__dirname + "/css"));
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