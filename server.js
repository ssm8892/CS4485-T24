import express from "express";
import mysql from 'mysql';
import path from 'path';
import axios from "axios";
import { fileURLToPath } from 'url';
import cheerio from "cheerio";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'online_tutoring'
});

// Information of logged on user
var firstName = "";
var lastName = "";
var email = "";
var accountType = "";

// Magic for POST requests
app.use(express.urlencoded({extended:false}));

app.use(express.static(__dirname));
app.use(express.static(__dirname + "/assets"));
app.use(express.static(__dirname + "/js"));

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html");
})

app.get('/index', (req, res) => {
  if (firstName != "" && lastName != "" && email != "" && accountType != "")
    resetUser();
    
  res.sendFile(__dirname + "/index.html");
})

app.get('/home', (req, res) => {
  if (firstName != "" && lastName != "" && email != "" && accountType != "")
    res.sendFile(__dirname + "/home.html");
  else
    res.sendFile(__dirname + "/index.html");
})

function executeRows(query) {
  return new Promise((resolve, reject) => {
    con.query(query, function(err, result) {
      if (err) {
        // Returning the error
        reject(err);
      }
      resolve(result);
    });
  });
}

// Rest user information
function resetUser(first_name, last_name, email, account_type) {
  first_name = "";
  last_name = "";
  email = "";
  account_type = "";

  console.log("reset");
}

function setUser(first_name, last_name, email, account_type) {
  first_name = first_name;
  last_name = last_name;
  email = email;
  account_type = account_type;

  console.log(first_name);
  console.log(last_name);
  console.log(email);
  console.log(account_type);
}

app.get('/login', (req, res) => {
  res.sendFile(__dirname + "/index.html");
})

// Login as user (still working)
app.post('/login', async (req, res) => {
  // Email and password
  const email = req.body.user_email;
  const password = req.body.user_password;
  
  // Get query pertaining to email and password
  const query = `select * from student where email = '${email}' and student_password = '${password}';`;
  const dbResult = await executeRows(query);
  
  if (dbResult.length > 0) {
    // Save login info and send first name
    setUser(dbResult[0]['first_name'], dbResult[0]['last_name'], dbResult[0]['email'], "Student");
    const nameToSend = dbResult[0]['first_name'].toUpperCase();
    
    // Send data to HTML
    fs.readFile('home.html', 'utf8', (err, data) => {
      if (err)
        console.log("Error");
      
        // Send variable to HTML
      const html = data.replace('{name}', nameToSend);
      res.send(html);
    })
    // res.sendFile(__dirname + "/home.html", {name_to_send: name_to_send});
  }
  else
    res.sendFile(__dirname + "/index.html");
});

app.get('/signup', (req, res) => {
  res.sendFile(__dirname + "/index.html");
})

// Sign up as a user (still working)
app.post('/signup', async (req, res) => {
  // Info to sign up
  const firstName = req.body.firstname;
  const lastName = req.body.lastname;
  const email = req.body.email;
  const phone = req.body.phone;
  const password = req.body.password;

  // Get query to see if student exists
  const query = `select * from student where email = '${email}' or student_password = '${password}' or phone_no = '${phone}';`;
  const dbResult = await executeRows(query);

  // Student already exists
  if (dbResult.length > 0) {
    console.log("User is already registered!"); 
    // res.render('index');
    res.sendFile(__dirname + "/index.html");
  }
  // New student
  else {
    // Get random ID and insert row into table
    var random_id = Math.floor(Math.random() * (10000000000 - 1000000000) + 1000000000)
    const new_query = `insert into student (student_id, student_password, first_name, last_name, email, phone_no, profile_pic, total_tutoring_hours) values ('${random_id}', '${password}', '${firstName}', '${lastName}', '${email}', '${phone}', LOAD_FILE(''), ${0});`;

    // Execute query insertion
    con.query(new_query, (err, rows) => {
      if(err) 
        console.log("Error!");
    });
    // res.render('index');
    res.sendFile(__dirname + "/index.html");
  }
});

app.get('/become-tutor', (req, res) => {
  res.sendFile(__dirname + "/index.html");
})

// Become a tutor (still working)
app.post('/become-tutor', async(req, res) => {
  // Info to become a tutor
  const firstName = req.body.firstname;
  const lastName = req.body.lastname;
  const email = req.body.email;
  const phone = req.body.phone;
  const password = req.body.password;
  const bio = req.body.bio;
  const subjects = req.body.subjects;
  const timings = req.body.timings;

  // Get query to see if tutor exists
  const query = `select * from tutor where email = '${email}' or phone_no = '${phone}' or tutor_password = '${password}';`
  const dbResult = await executeRows(query);

  // Tutor already exists
  if (dbResult.length > 0) {
    console.log("Tutor is already registered!"); 
    // res.render('index');
    res.sendFile(__dirname + "/index.html");
  }
  // New tutor
  else {
    // Get random ID and insert row into table
    var random_id = Math.floor(Math.random() * (10000000000 - 1000000000) + 1000000000)
    const new_query = `insert into tutor (tutor_id, tutor_password, first_name, last_name, email, phone_no, profile_pic, bio, subject_expertise, hours_avaliable, total_tutoring_hours) values ('${random_id}', '${password}', '${firstName}', '${lastName}', '${email}', '${phone}', LOAD_FILE(''), "${bio}", "${subjects}", '${timings}', ${0});`;
    
    // Execute query insertion
    con.query(new_query, (err, rows) => {
      if(err) 
        console.log("Error");
    });
    // res.render('index');
    res.sendFile(__dirname + "/index.html");
  }
});

app.get('/contact', (req, res) => {
  res.sendFile(__dirname + "/index.html");
})

// Contact us (still working)
app.post('/contact', async(req, res) => {
  // Contact form info
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const message = req.body.message;
  // res.render('index');
  res.sendFile(__dirname + "/index.html");
});

app.get('/book', (req, res) => {
  res.sendFile(__dirname + "/index.html");
})

// Book appointment with tutor (still working)
app.post('/book', async(req, res) => {
  const subject = req.body.subject;
  const date = req.body.date;
  const time = req.body.time;
  const email = req.body.email;
  // res.render('home');
  res.sendFile(__dirname + "/home.html");
})

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