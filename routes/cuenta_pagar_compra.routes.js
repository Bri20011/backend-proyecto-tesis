module.exports = app => {
    const cuenta_pagar_compra = require("../controllers/cuenta_pagar_compra.controller.js");
  
    var router = require("express").Router();
  
    // Create a new CuentaPagar
    router.post("/", cuenta_pagar_compra.create);
    router.get("/", cuenta_pagar_compra.findAll);
    app.use('/api/cuenta_pagar_compra', router);
  

  };