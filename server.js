import express from 'express';
import hbs from 'hbs';
import mysql from 'mysql';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import { totalmem } from 'os';
import multer from 'multer';
import cheerio from 'cheerio';
import { add, format } from 'date-fns';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Set up Multer and storage to handle file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Set up view engine and views directory
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'online_tutoring'
});

// Information of logged on user
global.firstName = "";
global.lastName = "";
global.email = "";
global.accountType = "";

// Information of logged on user
global.profilePic = "";
global.nameToSend = "";
global.fullName = "";
global.totalTutoringHours = 0;
global.favorites = [];

// Magic for POST requests
app.use(express.urlencoded({extended:true}));

app.use(fileUpload());
app.use(express.static(__dirname));
app.use(express.static(__dirname + "/assets"));
app.use(express.static(__dirname + "/js"));

// Get query pertaining to tutors
const tutorsQuery = `select * from tutor;`;
const dbTutors = await executeRows(tutorsQuery);

// Store dictionaries of tutor info
global.displayTutors = [];

// Searched tutors
global.searchedTutors = [];

// Store information of appointments
global.appointments = [];

for (let i=0; i<dbTutors.length; i++) {
  // Make default
  var prePicture = "assets/avataaars.svg";

  // Update image
  if (dbTutors[i]['profile_pic'] != "")
    prePicture = dbTutors[i]['profile_pic']

  // Dictionary of tutor info
  const tutorDict = {
    fullName: dbTutors[i]['first_name'] + " " + dbTutors[i]['last_name'],
    email: dbTutors[i]['email'],
    phone: dbTutors[i]['phone_no'],
    bio: dbTutors[i]['bio'],
    expertise: dbTutors[i]['subject_expertise'],
    days: dbTutors[i]['days_available'].split(','),
    times: dbTutors[i]['hours_available'].split(','),
    courses: dbTutors[i]['subject_expertise'].split(', '),
    image: prePicture,
    index: i,
  }
  displayTutors.push(tutorDict);
}

function updateTutors(dbUpdate, specific) {
  // If searching all tutor data, store dictionaries of tutor info
  if (specific == "All")
    global.displayTutors = []; 

  // If searching searched data, store dictionaries of searched tutor info
  else if (specific == "Searched")
    global.searchedTutors = [];

  for (let i=0; i<dbUpdate.length; i++) {
    // Make default
    var picture = "assets/avataaars.svg";

    // Update image
    if (dbUpdate[i]['profile_pic'] != "")
      picture = dbUpdate[i]['profile_pic']

    // Dictionary of tutor info
    const tutorDict = {
      fullName: dbUpdate[i]['first_name'] + " " + dbUpdate[i]['last_name'],
      email: dbUpdate[i]['email'],
      phone: dbUpdate[i]['phone_no'],
      bio: dbUpdate[i]['bio'],
      expertise: dbUpdate[i]['subject_expertise'],
      days: dbUpdate[i]['days_available'].split(','),
      times: dbUpdate[i]['hours_available'].split(','),
      courses: dbUpdate[i]['subject_expertise'].split(', '),
      favorite: false,
      image: picture,
      index: i
    }
    // Add to dict of all tutors
    if (specific == "All")
      global.displayTutors.push(tutorDict);

    // Add to dict of searched tutors
    else if (specific == "Searched")
      global.searchedTutors.push(tutorDict);
  }
}

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
  global.firstName = "";
  global.lastName = "";
  global.email = "";
  global.accountType = "";

  global.profilePic = "";
  global.nameToSend = "";
  global.fullName = "";
  global.totalTutoringHours = 0;
  global.favorites = []

  global.appointments = [];
}

// Set current user
function setUser(firstName, lastName, email, accountType, profilePic, nameToSend, fullName, totalTutoringHours, favorites) {
  // Default image
  var profile = "assets/avataaars.svg"

  // Update image if defined
  if (profilePic != "")
    profile = profilePic

  // Set user info
  global.firstName = firstName;
  global.lastName = lastName;
  global.email = email;
  global.accountType = accountType;

  // Set user info
  global.profilePic = profile;
  global.nameToSend = nameToSend;
  global.fullName = fullName;
  global.totalTutoringHours = totalTutoringHours;
  global.favorites = favorites;
}

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

app.get('/', (req, res) => {
  res.render(__dirname + "\\index.hbs", { tutors: global.displayTutors });
});

app.get('/index', (req, res) => {
  resetUser();
  res.render(__dirname + "\\index.hbs", { tutors: global.displayTutors });
});

app.get('/home', (req, res) => {
  if (firstName != "" && lastName != "" && email != "" && accountType != "")
    res.render(__dirname + "\\home.hbs", { tutors: global.displayTutors });
  else
    res.render(__dirname + "\\index.hbs", { tutors: global.displayTutors });
});

app.get('/tutor-login', (req, res) => {
  if (firstName != "" && lastName != "" && email != "" && accountType == "Tutor")
    res.render(__dirname + "\\tutor.html", { name: global.nameToSend, fullName: global.fullName, profilePic: global.profilePic, hours: global.totalTutoringHours, appointments: global.appointments });
  else
    res.render(__dirname + "\\index.hbs", { tutors: global.displayTutors });
});

// Login as tutor 
app.post('/tutor-login', async(req, res) => {
  // Email and password
  const email = req.body.tutor_email;
  var password = req.body.tutor_password;
  
  // Get query pertaining to email and password
  const query = `select * from tutor where email = '${email}' and tutor_password = CONCAT('*', UPPER(SHA1(UNHEX(SHA1('${password}')))));`;
  const dbResult = await executeRows(query);
  
  if (dbResult.length > 0) {
    // Get first name to send, full name, and total tutoring hours
    const nameToSend = dbResult[0]['first_name'].toUpperCase();
    const fullName = nameToSend + " " + dbResult[0]['last_name'].toUpperCase();
    const totalTutoringHours = dbResult[0]['total_tutoring_hours'];

    // Set user data
    setUser(dbResult[0]['first_name'], dbResult[0]['last_name'], dbResult[0]['email'], "Student", dbResult[0]['profile_pic'], nameToSend, fullName, totalTutoringHours);
    global.appointments = [];
    
    // Get appointments needed
    const tempFullName = global.firstName + " " + global.lastName;
    const query = `select * from appointments where tutor_name = '${tempFullName}';`
    const dbResultAppts = await executeRows(query);

    for (let i=0; i<dbResultAppts.length; i++) {
      const tutorDict = {
        ID: dbResultAppts[i]['appointment_id'],
        date: dbResultAppts[i]['written_date'],
        time: dbResultAppts[i]['written_time'],
        duration: dbResultAppts[i]['duration'],
        tutor: dbResultAppts[i]['tutor_name'],
        student: dbResultAppts[i]['student_name'],
        subject: dbResultAppts[i]['subject_name'],
        index: i
      }
      global.appointments.push(tutorDict);
    }

    // Send data to HTML
    res.render(__dirname + "\\tutor.hbs", { name: global.nameToSend, fullName: global.fullName, profilePic: global.profilePic, hours: global.totalTutoringHours, appointments: global.appointments });
  }
  // Send invalid login to HTML
  else if (dbResult.length == 0 && email != "" && password != "")
    res.render(__dirname + "\\index.hbs", { welcome: "Incorrect username or password!" });
  // Reload index 
  else 
    res.render(__dirname + "\\index.hbs", { tutors: global.displayTutors });
});

app.get('/login', (req, res) => {
  if (firstName != "" && lastName != "" && email != "" && accountType == "Student")
  res.render(__dirname + "\\home.hbs", { name: global.nameToSend, fullName: global.fullName, hours: global.totalTutoringHours, tutors: global.displayTutors, appointments: global.appointments });
  else
    res.render(__dirname + "\\index.hbs", { tutors: global.displayTutors });
});

// Login as student
app.post('/login', async(req, res) => {
  // Email and password
  const email = req.body.user_email;
  var password = req.body.user_password;
  
  // Get query pertaining to email and password
  const query = `select * from student where email = '${email}' and student_password = CONCAT('*', UPPER(SHA1(UNHEX(SHA1('${password}')))));`;
  const dbResult = await executeRows(query);
  
  if (dbResult.length > 0) {
    // Get first name to send, full name, total tutoring hours, and favorite tutors
    const nameToSend = dbResult[0]['first_name'].toUpperCase();
    const fullName = nameToSend + " " + dbResult[0]['last_name'].toUpperCase();
    const totalTutoringHours = dbResult[0]['total_tutoring_hours'];

    // Set user data
    setUser(dbResult[0]['first_name'], dbResult[0]['last_name'], dbResult[0]['email'], "Student", dbResult[0]['profile_pic'], nameToSend, fullName, totalTutoringHours);
    global.appointments = [];

    // Get appointments needed
    const tempFullName = global.firstName + " " + global.lastName;
    const query = `select * from appointments where student_name = '${tempFullName}';`
    const dbResultAppts = await executeRows(query);

    // Add appointments
    for (let i=0; i<dbResultAppts.length; i++) {
      const tutorDict = {
        ID: dbResultAppts[i]['appointment_id'],
        date: dbResultAppts[i]['written_date'],
        time: dbResultAppts[i]['written_time'],
        duration: dbResultAppts[i]['duration'],
        tutor: dbResultAppts[i]['tutor_name'],
        student: dbResultAppts[i]['student_name'],
        subject: dbResultAppts[i]['subject_name'],
        index: i
      }
      global.appointments.push(tutorDict);
    }

    // Send data to HTML
    res.render(__dirname + "\\home.hbs", { name: nameToSend, fullName: fullName, hours: totalTutoringHours, profilePic: global.profilePic, tutors: global.displayTutors, appointments: global.appointments});
  }
  // Send invalid login to HTML
  else if (dbResult.length == 0 && email != "" && password != "")
    res.render(__dirname + "\\index.hbs", { welcome: "Incorrect username or password!" });
  // Reload index 
  else 
    res.render(__dirname + "\\index.hbs", { tutors: global.displayTutors });
});

app.get('/become-tutor', (req, res) => {
  res.render(__dirname + "\\index.hbs", { tutors: global.displayTutors });
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

  var daysInput = req.body.days;
  var timingsInput = req.body.shifts;
  var img = "";

  var days = daysInput.join(', ');
  var timings = timingsInput.join(', ')

  // Password evaluation
  const passwordEval = checkValidPassword(password);

  // Get query to see if tutor exists
  const query = `select * from tutor where email = '${email}' or phone_no = '${phone}' or tutor_password = CONCAT('*', UPPER(SHA1(UNHEX(SHA1('${password}')))));`
  const dbResult = await executeRows(query);

  // Get query to see if student exists
  const query2 = `select * from student where email = '${email}' or phone_no = '${phone}' or student_password = CONCAT('*', UPPER(SHA1(UNHEX(SHA1('${password}')))));`
  const dbResult2 = await executeRows(query2);

  // Tutor already exists
  if (dbResult.length > 0 || dbResult2.length > 0) 
    res.render(__dirname + "\\index.hbs", { tutors: global.displayTutors, welcome: "Email, phone, and/or password already in use!"});
  
  // Invalid password
  else if (dbResult.length == 0 && dbResult2.length == 0 && !passwordEval) 
    res.render(__dirname + "\\index.hbs", { tutors: global.displayTutors, welcome: "Your password must be at least 8 characters, with at least one number, uppercase letter, and lowercase letter!"});
  
  // New tutor
  else if (dbResult.length == 0 && dbResult2.length == 0 && passwordEval) {
    // Get random ID and insert row into table
    var randomId = Math.floor(Math.random() * (10000000000 - 1000000000) + 1000000000)
    const newQuery = `insert into tutor (tutor_id, tutor_password, first_name, last_name, email, phone_no, profile_pic, bio, subject_expertise, days_available, hours_available, total_tutoring_hours) values ('${randomId}', CONCAT('*', UPPER(SHA1(UNHEX(SHA1('${password}'))))), '${firstName}', '${lastName}', '${email}', '${phone}', "","${bio}", "${subjects}", '${days}', '${timings}', ${0});`;

    // Execute query insertion
    con.query(newQuery, (err, rows) => {
      if(err) 
        console.log("Error");
    });
    // Update tutors
    const newDbTutors = await executeRows(`select * from tutor;`);
    updateTutors(newDbTutors, "All");

    res.render(__dirname + "\\index.hbs", { tutors: global.displayTutors, welcome: "Tutor successfully registered!"});
  }
});

app.get('/signup', (req, res) => {
  res.render(__dirname + "\\index.hbs", { tutors: global.displayTutors });
});

// Sign up as a user
app.post('/signup', async(req, res) => {
  // Info to sign up
  const firstName = req.body.firstname;
  const lastName = req.body.lastname;
  const email = req.body.email;
  const phone = req.body.phone;
  const password = req.body.password;

  // Password evaluation
  const passwordEval = checkValidPassword(password);

  // Get query to see if student exists
  const query = `select * from student where email = '${email}' or student_password = CONCAT('*', UPPER(SHA1(UNHEX(SHA1('${password}'))))) or phone_no = '${phone}';`;
  const dbResult = await executeRows(query);

  // Get query to see if tutor exists
  const query2 = `select * from tutor where email = '${email}' or phone_no = '${phone}' or tutor_password = CONCAT('*', UPPER(SHA1(UNHEX(SHA1('${password}')))));`
  const dbResult2 = await executeRows(query2);

  // Student already exists
  if (dbResult.length > 0 || dbResult2 > 0) 
    res.render(__dirname + "\\index.hbs", { tutors: global.displayTutors, welcome: "Email, phone, and/or password already in use!"});
  
  // Password evaluation fails
  else if (dbResult.length == 0 && dbResult2.length == 0 && !passwordEval) 
    res.render(__dirname + "\\index.hbs", { tutors: global.displayTutors, welcome: "Your password must be at least 8 characters, with at least one number, uppercase letter, and lowercase letter!"});
  
  // New student
  else if (dbResult.length == 0 && dbResult2.length == 0 && passwordEval) {
    // Get random ID and insert row into table
    var randomId = Math.floor(Math.random() * (10000000000 - 1000000000) + 1000000000)
    const newQuery = `insert into student (student_id, student_password, first_name, last_name, email, phone_no, profile_pic, total_tutoring_hours) values ('${randomId}', CONCAT('*', UPPER(SHA1(UNHEX(SHA1('${password}'))))), '${firstName}', '${lastName}', '${email}', '${phone}', LOAD_FILE(''), ${0});`;
    
    // Execute query insertion
    con.query(newQuery, (err, rows) => {
      if(err) 
        console.log("Error!");
    });

    res.render(__dirname + "\\index.hbs", { tutors: global.displayTutors, welcome: "Student successfully registered!"});
  }
});

app.post('/upload-tutor-pic', async(req, res) => {
  
  if(!req.files){
    res.send('File was not found');
    return;
  }
  
  // Get file name
  const avatar = req.files.avatar;
  
  // Catch error
  if(!avatar) 
    return res.sendStatus(400);

  // Get filename and move it
  var img = __dirname+"\\profile_pics\\"+avatar.name;
  avatar.mv(img);
  global.profilePic = `profile_pics/${avatar.name}`;

  // Update image name
  const newQuery = `update tutor set profile_pic = '${global.profilePic}' where first_name = '${global.firstName}' and last_name = '${global.lastName}' and email = '${global.email}';`;

  // Execute query insertion
  con.query(newQuery, (err, rows) => {
    if(err) 
      console.log("Error");
  });

  // Update tutors
  const newDbTutors = await executeRows(`select * from tutor;`);
  updateTutors(newDbTutors, "All");

  res.render(__dirname + "\\tutor.hbs", { name: global.nameToSend, fullName: global.fullName, profilePic: global.profilePic, hours: global.totalTutoringHours, appointments: global.appointments});
});

app.post('/upload-pic', async(req, res) => {
  // Send error message
  if(!req.files){
    res.send('File was not found');
    return;
  }
  // Get file name
  const avatar = req.files.avatar;

  // Catch error
  if(!avatar) 
    return res.sendStatus(400);

  // Get filename and move it
  var img = __dirname+"\\profile_pics\\"+avatar.name;
  avatar.mv(img);
  global.profilePic = `profile_pics/${avatar.name}`;
  
  // Update image name
  const newQuery = `update student set profile_pic = '${global.profilePic}' where first_name = '${global.firstName}' and last_name = '${global.lastName}' and email = '${global.email}';`;
  
  // Execute query insertion
  con.query(newQuery, (err, rows) => {
    if(err) 
      console.log("Error");
  });

  // Update tutors
  const newDbTutors = await executeRows(`select * from tutor;`);
  updateTutors(newDbTutors, "All");

  res.render(__dirname + "\\home.hbs", { name: global.nameToSend, fullName: global.fullName, hours: global.totalTutoringHours, profilePic: global.profilePic, tutors: global.displayTutors, appointments: global.appointments });
});

app.post('/index-search', async(req, res) => {
  // Input of searchbar and string length of input
  const search = req.body.find;
  const len = search.length;

  // If searched for nothing, reload
  if (len == 0)
    res.render(__dirname + "\\index.hbs", { tutors: global.displayTutors });
  
  // Else, try searching
  else {
    // Find search keyword
    const searchQuery = `select * from tutor where left(first_name, ${len}) = '${search}' or left(last_name, ${len}) = '${search}' or left(subject_expertise, ${len}) = '${search}';`;
    const newDbSearch = await executeRows(searchQuery);
    updateTutors(newDbSearch, "Searched");

    res.render(__dirname + "\\index.hbs", { tutors: global.searchedTutors });
  }
});

app.post('/home-search', async(req, res) => {
  // Input of searchbar and string length of input
  const search = req.body.find;
  const len = search.length;

  // If searched for nothing, reload
  if (len == 0)
    res.render(__dirname + "\\home.hbs", { name: global.nameToSend, fullName: global.fullName, hours: global.totalTutoringHours, profilePic: global.profilePic, tutors: global.displayTutors, appointments: global.appointments });
  
  // Else, try searching
  else {
    // Find search keyword
    const searchQuery = `select * from tutor where left(first_name, ${len}) = '${search}' or left(last_name, ${len}) = '${search}' or left(subject_expertise, ${len}) = '${search}';`;
    const newDbSearch = await executeRows(searchQuery);
    updateTutors(newDbSearch, "Searched");

    res.render(__dirname + "\\home.hbs", { name: global.nameToSend, fullName: global.fullName, hours: global.totalTutoringHours, profilePic: global.profilePic, tutors: global.searchedTutors, appointments: global.appointments });
  }
});

/*
app.post('/favorites', async(req, res) => {
  // New tutor to add to favorites list
  const val = req.body.myH1;

  
  const possibility = `select tutor_name from favorites where student_fname = '${}' and student_lname = '${}' and email = '${}';`;

  const query = `insert into favorites (student_fname, student_lname, student_email, tutor_name) values('${global.firstName}', '${global.lastName}', '${global.email}', '${val}');`;
  const querySearch = await executeRows(query);
  console.log(querySearch);
  
  res.render(__dirname + "\\home.hbs", { name: global.nameToSend, fullName: global.fullName, hours: global.totalTutoringHours, profilePic: global.profilePic, tutors: global.displayTutors, favorites: global.favorites});
});
*/

// Book appointment with tutor (still working)
app.post('/book', async(req, res) => {
  // Hidden variable
  const tutor = req.body.myH2;

  // Form input variables
  const subject = req.body.apptSub;
  const date = req.body.apptDays;
  const time = req.body.apptTime;

  // Create an array of day of week names
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeekIndex = daysOfWeek.indexOf(date);

  // Get the current date and add one day
  const today = new Date();
  var tomorrow = add(today, { days: 1 });

  // Loop until next day is found
  while (tomorrow.getDay() !== dayOfWeekIndex) { 
    tomorrow = add(tomorrow, { days: 1 });
  }

  // Format the resulting date as a written date
  const writtenDate = format(tomorrow, 'EEEE, MMMM d, yyyy');
  const tempFullName = global.firstName + " " + global.lastName;
  
  // Booking queries
  var randomId = Math.floor(Math.random() * (10000000000 - 1000000000) + 1000000000)
  const newBooking = `insert into appointments (appointment_id, written_date, written_time, duration_time, tutor_name, student_name, subject_name) values('${randomId}', '${writtenDate}', '${time}', ${2}, '${tutor}', '${tempFullName}', '${subject}');`

  // Execute query insertion
  con.query(newBooking, (err, rows) => {
    if (err) 
      console.log("Error");
  });

  global.appointments = [];

  // Get appointments needed
  const query = `select * from appointments where student_name = '${tempFullName}';`
  const dbResultAppts = await executeRows(query);

  for (let i=0; i<dbResultAppts.length; i++) {
    const tutorDict = {
      ID: dbResultAppts[i]['appointment_id'],
      date: dbResultAppts[i]['written_date'],
      time: dbResultAppts[i]['written_time'],
      duration: dbResultAppts[i]['duration'],
      tutor: dbResultAppts[i]['tutor_name'],
      student: dbResultAppts[i]['student_name'],
      subject: dbResultAppts[i]['subject_name'],
      index: i
    }
    global.appointments.push(tutorDict);
  }

  res.render(__dirname + "\\home.hbs", { name: global.nameToSend, fullName: global.fullName, hours: global.totalTutoringHours, profilePic: global.profilePic, tutors: global.displayTutors, appointments: global.appointments });
})

app.listen(3000, () => {
  console.log(`Server running on port ${PORT}`);
});