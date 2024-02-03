module.exports = app => {
    const auth = require("../controllers/auth.controller.js");
  
    var router = require("express").Router();
  
    // Autenticar usuario
    router.post("/", auth.login);
  
    app.use('/api/login', router);
  };