module.exports = app => {
    const nota_credito_venta = require("../controllers/nota_credito_venta.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Nota de Credito Venta
    router.post("/", nota_credito_venta.create);
  
    // Retrieve all Nota de Credito Venta
    router.get("/", nota_credito_venta.findAll);
  
    // Retrieve a single Nota de Credito Venta with id
    router.get("/:id", nota_credito_venta.findOne);
  
    // Update a Nota de Credito Venta with id
    router.put("/:id", nota_credito_venta.update);
  
    // Delete a Nota de Credito Venta with id
    router.delete("/:id", nota_credito_venta.delete);
  
    app.use('/api/nota_credito_venta', router);
  };