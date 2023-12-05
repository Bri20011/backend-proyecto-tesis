module.exports = app => {
    const nota_credito_compra = require("../controllers/nota_credito_compra.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Nota de Credito Compra
    router.post("/", nota_credito_compra.create);
  
    // Retrieve all Nota de Credito Compra
    router.get("/", nota_credito_compra.findAll);
  
    // Retrieve a single Nota de Credito Compra with id
    router.get("/:id", nota_credito_compra.findOne);
  
    // Update a Nota de Credito Compra with id
    router.put("/:id", nota_credito_compra.update);
  
    // Delete a Nota de Credito Compra with id
    router.delete("/:id", nota_credito_compra.delete);
  
    app.use('/api/nota_credito_compra', router);
  };