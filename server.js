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

// Get query pertaining to tutors
const tutorsQuery = `select * from tutor;`;
const dbTutors = await executeRows(tutorsQuery);

// Store dictionaries of tutor info
var displayTutors = [];

for (let i=0; i<dbTutors.length; i++) {
  // Dictionary of tutor info
  const tutorDict = {
    fullName: dbTutors[i]['first_name'] + " " + dbTutors[0]['last_name'],
    email: dbTutors[i]['email'],
    phone: dbTutors[i]['phone_no'],
    bio: dbTutors[i]['bio'],
    expretise: dbTutors[i]['subject_expertise']
  }
  displayTutors.push(tutorDict);
}
console.log(displayTutors)

app.get('/', (req, res) => {
  // res.sendFile(__dirname + "/index.html");
  // Send data to HTML
  fs.readFile('index.html', 'utf8', (err, data) => {
    if (err)
      console.log("Error");
    
    // Send variable to HTML
    const html = data.replace('{tutors}', displayTutors);
    res.send(html);
  })
})

app.get('/index', (req, res) => {
  resetUser();
  // res.sendFile(__dirname + "/index.html");
  // Send data to HTML
  fs.readFile('index.html', 'utf8', (err, data) => {
    if (err)
      console.log("Error");
    
    // Send variable to HTML
    const html = data.replace('{tutors}', displayTutors);
    res.send(html);
  })
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
function resetUser() {
  // Reset user info
  firstName = "";
  lastName = "";
  email = "";
  accountType = "";
}

// Set current user
function setUser(firstName, lastName, email, accountType) {
  // Set user info
  firstName = firstName;
  lastName = lastName;
  email = email;
  accountType = accountType;
}

app.get('/tutor-login', (req, res) => {
  if (firstName != "" && lastName != "" && email != "" && accountType == "Tutor")
    res.sendFile(__dirname + "/tutor.html");
  else
    res.sendFile(__dirname + "/index.html");
})

// Login as tutor 
app.post('/tutor-login', async (req, res) => {
  // Email and password
  const email = req.body.tutor_email;
  var password = req.body.tutor_password;
  
  // Get query pertaining to email and password
  const query = `select * from tutor where email = '${email}' and tutor_password = PASSWORD('${password}');`;
  const dbResult = await executeRows(query);
  
  if (dbResult.length > 0) {
    // Save login info and send first name
    setUser(dbResult[0]['first_name'], dbResult[0]['last_name'], dbResult[0]['email'], "Tutor");
    const nameToSend = dbResult[0]['first_name'].toUpperCase();

    // Get full name and total number of hours completed
    const fullName = nameToSend + " " + dbResult[0]['last_name'].toUpperCase();
    const total_tutoring_hours = dbResult[0]['total_tutoring_hours'];
    
    // Send data to HTML
    fs.readFile('tutor.html', 'utf8', (err, data) => {
      if (err)
        console.log("Error");
      
      // Send variable to HTML
      const html = data.replace('{name}', nameToSend).replace('{full_name}', fullName).replace('{hours}', total_tutoring_hours);
      res.send(html);
    })
  }
  else if (dbResult.length == 0 && email != "" && password != "") {
    // Send data to HTML
    fs.readFile('index.html', 'utf8', (err, data) => {
      if (err)
        console.log("Error");
      
      // Send invalid login to HTML
      const html = data.replace('{welcome}', "Incorrect username or password!");
      res.send(html);
    })
  }
  else 
    res.sendFile(__dirname + "/index.html");
});

app.get('/login', (req, res) => {
  if (firstName != "" && lastName != "" && email != "" && accountType == "Student")
    res.sendFile(__dirname + "/home.html");
  else
    res.sendFile(__dirname + "/index.html");
})

// Login as student
app.post('/login', async (req, res) => {
  // Email and password
  const email = req.body.user_email;
  var password = req.body.user_password;
  
  // Get query pertaining to email and password
  const query = `select * from student where email = '${email}' and student_password = PASSWORD('${password}');`;
  const dbResult = await executeRows(query);
  
  if (dbResult.length > 0) {
    // Save login info and send first name
    setUser(dbResult[0]['first_name'], dbResult[0]['last_name'], dbResult[0]['email'], "Student");
    const nameToSend = dbResult[0]['first_name'].toUpperCase();
    
    // Get full name and total number of hours completed
    const fullName = nameToSend + " " + dbResult[0]['last_name'].toUpperCase();
    const total_tutoring_hours = dbResult[0]['total_tutoring_hours'];

    // Send data to HTML
    fs.readFile('home.html', 'utf8', (err, data) => {
      if (err)
        console.log("Error");
      
      // Send variable to HTML
      const html = data.replace('{name}', nameToSend).replace('{full_name}', fullName).replace('{hours}', total_tutoring_hours).replace('{tutors}', displayTutors);
      res.send(html);
    })
    // res.sendFile(__dirname + "/home.html", {name_to_send: name_to_send});
  }
  else if (dbResult.length == 0 && email != "" && password != "") {
    // Send data to HTML
    fs.readFile('index.html', 'utf8', (err, data) => {
      if (err)
        console.log("Error");
      
      // Send invalid login to HTML
      const html = data.replace('{welcome}', "Incorrect username or password!");
      res.send(html);
    })
  }
  else 
    res.sendFile(__dirname + "/index.html");
});

function checkValidPassword(password) {
  // If password less than 8 characters, false
  if (password.length < 8)
    return false

  else {
    // Get number of lowercase, uppercase, and numbers
    var numUpper = 0;
    var numLower = 0;
    var numNumbers = 0;

    // If original character equal to lowercase, increment
    for (let i = 0; i < password.length; i++) {
      // Is lowercase
      if (password[i] === password[i].toUpperCase()) 
        ++numUpper;
      
      // Is uppercase
      if (password[i] === password[i].toLowerCase()) 
        ++numLower;
      
      // Is a number
      if (!isNaN(password[i]))
        ++numNumbers;
    }

    // Must have at least one of each, else false
    if (numUpper >= 1 && numLower >= 1 && numNumbers >= 1)
      return true;
    else
      return false;
  }
}

app.get('/signup', (req, res) => {
  res.sendFile(__dirname + "/index.html");
})

// Sign up as a user
app.post('/signup', async (req, res) => {
  // Info to sign up
  const firstName = req.body.firstname;
  const lastName = req.body.lastname;
  const email = req.body.email;
  const phone = req.body.phone;
  const password = req.body.password;

  // Password evaluation
  const passwordEval = checkValidPassword(password);

  // Get query to see if student exists
  const query = `select * from student where email = '${email}' or student_password = '${password}' or phone_no = '${phone}';`;
  const dbResult = await executeRows(query);

  // Get query to see if tutor exists
  const query2 = `select * from tutor where email = '${email}' or phone_no = '${phone}' or tutor_password = '${password}';`
  const dbResult2 = await executeRows(query2);

  // Student already exists
  if (dbResult.length > 0 || dbResult2 > 0) {
    // Send data to HTML
    fs.readFile('index.html', 'utf8', (err, data) => {
      if (err)
        console.log("Error");
      
      // Send invalid login to HTML
      const html = data.replace('{welcome}', "Email, phone, and/or password already in use!");
      res.send(html);
    })
  }
  // Password evaluation fails
  else if (dbResult.length == 0 && dbResult2.length == 0 && !passwordEval) {
    // Send data to HTML
    fs.readFile('index.html', 'utf8', (err, data) => {
      if (err)
        console.log("Error");
      
      // Send invalid login to HTML
      const html = data.replace('{welcome}', "Your password must be at least 8 characters, with at least one number, uppercase letter, and lowercase letter");
      res.send(html);
    })
  }
  // New student
  else if (dbResult.length == 0 && dbResult2.length == 0 && passwordEval) {
    // Get random ID and insert row into table
    var random_id = Math.floor(Math.random() * (10000000000 - 1000000000) + 1000000000)
    const new_query = `insert into student (student_id, student_password, first_name, last_name, email, phone_no, profile_pic, total_tutoring_hours) values ('${random_id}', '${password}', '${firstName}', '${lastName}', '${email}', '${phone}', LOAD_FILE(''), ${0});`;

    // Execute query insertion
    con.query(new_query, (err, rows) => {
      if(err) 
        console.log("Error!");
    });
    
    // Send data to HTML
    fs.readFile('index.html', 'utf8', (err, data) => {
      if (err)
        console.log("Error");
      
      // Send invalid login to HTML
      const html = data.replace('{welcome}', "Student successfully registered!");
      res.send(html);
    })
  }
});

app.get('/become-tutor', (req, res) => {
  res.sendFile(__dirname + "/index.html");
})

// Become a tutor
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

  // Password evaluation
  const passwordEval = checkValidPassword(password);

  // Get query to see if tutor exists
  const query = `select * from tutor where email = '${email}' or phone_no = '${phone}' or tutor_password = '${password}';`
  const dbResult = await executeRows(query);

  // Get query to see if student exists
  const query2 = `select * from student where email = '${email}' or phone_no = '${phone}' or student_password = '${password}';`
  const dbResult2 = await executeRows(query2);

  // Tutor already exists
  if (dbResult.length > 0 || dbResult2.length > 0) {
    // Send data to HTML
    fs.readFile('index.html', 'utf8', (err, data) => {
      if (err)
        console.log("Error");
      
      // Send invalid login to HTML
      const html = data.replace('{welcome}', "Email, phone, and/or password already in use!");
      res.send(html);
    })
  }
  else if (dbResult.length == 0 && dbResult2.length == 0 && !passwordEval) {
    // Send data to HTML
    fs.readFile('index.html', 'utf8', (err, data) => {
      if (err)
        console.log("Error");
      
      // Send invalid login to HTML
      const html = data.replace('{welcome}', "Your password must be at least 8 characters, with at least one number, uppercase letter, and lowercase letter");
      res.send(html);
    })
  }
  // New tutor
  else if (dbResult.length == 0 && dbResult2.length == 0 && passwordEval) {
    // Get random ID and insert row into table
    var random_id = Math.floor(Math.random() * (10000000000 - 1000000000) + 1000000000)
    const new_query = `insert into tutor (tutor_id, tutor_password, first_name, last_name, email, phone_no, profile_pic, bio, subject_expertise, hours_avaliable, total_tutoring_hours) values ('${random_id}', '${password}', '${firstName}', '${lastName}', '${email}', '${phone}', LOAD_FILE(''), "${bio}", "${subjects}", '${timings}', ${0});`;
    
    // Execute query insertion
    con.query(new_query, (err, rows) => {
      if(err) 
        console.log("Error");
    });
    
    // Send data to HTML
    fs.readFile('index.html', 'utf8', (err, data) => {
      if (err)
        console.log("Error");
      
      // Send invalid login to HTML
      const html = data.replace('{welcome}', "Tutor successfully registered!");
      res.send(html);
    })
  }
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