const express = require("express");
const app = express();
const port = 3000;
const env = require("dotenv").config();

const session = require('express-session');

app.use(session({
    secret: 'sessionesfac',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(express.static("app/public"));

app.set("view engine", "ejs");
app.set("views", "./app/views");

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.locals.autenticado = req.session.autenticado;
  next();
});

var rotas = require("./app/routes/router");
app.use("/", rotas);



const rotaAdm = require("./app/routes/router-adm");
app.use("/adm", rotaAdm);

app.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}\nhttp://localhost:${port}`);
});
app.use(express.urlencoded({ extended: true }))




