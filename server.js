const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.options("*", (req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Acesss-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS'); 
    res.header('Access-Control-Allow-Headers', 'Authorization, Content-Length, X-Requested-With');
    res.send(200);
})

app.use(express.json());

app.use(express.urlencoded({extended: false}));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${req.ip}`);
    next();
});

app.use(express.static("/assets/img"));
app.use(express.static(__dirname + "/css"));

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
    res.json({ "echo": req.params.word})
});

app.all('*', (req, res) => {
    res.send("Invalid route");
})

app.listen(PORT, () => console.log(`Listening on ${PORT}`));