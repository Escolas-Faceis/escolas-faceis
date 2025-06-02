const express = require("express");
const router = express.Router();

router.get("/", (req, res)=>{
    console.log(usuarios)
    res.render("pages/index-adm", { usuarios });
});

router.get("/adm-novo", (req, res)=>{
    res.render("pages/adm-usuario-novo");
});


module.exports = router;