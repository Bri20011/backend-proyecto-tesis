module.exports = app => {
    const nota_debito_compras = require("../controllers/nota_debito_compras.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Nota de Debito Compra
    router.post("/", nota_debito_compras.create);
  
    // Retrieve all Nota de Debito Compra
    router.get("/", nota_debito_compras.findAll);
  
    // Retrieve a single Nota de Debito Compra with id
    router.get("/:id", nota_debito_compras.findOne);
  
    // Update a Nota de Debito Compra with id
    router.put("/:id", nota_debito_compras.update);
  
    // Delete a Nota de Debito Compra with id
    router.delete("/:id", nota_debito_compras.delete);
  
    app.use('/api/nota_debito_compras', router);
  };