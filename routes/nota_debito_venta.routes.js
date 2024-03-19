module.exports = app => {
    const nota_debito_venta = require("../controllers/nota_debito_venta.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Nota de Debito Venta
    router.post("/", nota_debito_venta.create); 
  
    // Retrieve all Nota de Debito Venta
    router.get("/", nota_debito_venta.findAll);
  
    // Retrieve a single Nota de Debito Venta with id
    router.get("/:id", nota_debito_venta.findOne);
  
    // Update a Nota de Debito Venta with id
    router.put("/:id", nota_debito_venta.update);
  
    // Delete a Nota de Debito Venta with id
    router.delete("/:id", nota_debito_venta.delete);
  
    app.use('/api/nota_debito_venta', router);
  };