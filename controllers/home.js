const express = require('express');
const router = express.Router();


router.get("/", (req, res) => {
    res.send("home");
});

router.post("/home", (req, res) => {
    res.send("Cadastro efetuado com sucesso.");
});


module.exports = router;