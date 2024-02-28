module.exports = app => {
    const cuenta_pagar = require("../controllers/cuenta_pagar.controller.js");
  
    var router = require("express").Router();
  
    // Create a new CuentaPagar
    router.post("/", cuenta_pagar.create);
    router.get("/", cuenta_pagar.findAll);
    app.use('/api/cuenta_pagar', router);
  

  };