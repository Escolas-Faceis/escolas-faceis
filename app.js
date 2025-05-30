const express = require("express");
const app = express();
const port = 3000;
const env = require("dotenv").config();

app.use(express.static("app/public"));

app.set("view engine", "ejs");
app.set("views", "./app/views");

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

var rotas = require("./app/routes/router");
app.use("/", rotas);

const session = require('express-session');

app.use(session({
    secret: 'sessionesfac',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}\nhttp://localhost:${port}`);
});




