const express = require("express");
const app = express();
const port = 3000;
const env = require("dotenv").config();

const session = require('express-session');

app.use(session({
    secret: 'sessionesfac',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000  }
}));

app.use(express.static("app/public"));

app.set("view engine", "ejs");
app.set("views", "./app/views");

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  if (req.session.autenticado && (req.session.autenticado.req || req.session.autenticado.res)) {
    console.log("Sessão corrompida, resetando...");
    req.session.autenticado = { autenticado: null, id: null, tipo: null };
  }
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





