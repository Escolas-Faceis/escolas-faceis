const express = require("express");
const router = express.Router();

router.get("/", (req, res)=>{
    console.log(usuarios)
    res.render("pages/index-adm", { usuarios });
});

router.get("/novo", (req, res)=>{
    res.render("pages/adm-usuario-novo");
});

router.get("/list", (req, res)=>{
    res.render("pages/adm-list");
});



module.exports = router;