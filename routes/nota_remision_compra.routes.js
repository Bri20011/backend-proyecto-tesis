module.exports = app => {
    const nota_remision_compra = require("../controllers/nota_remision_compra.controller.js");
  
    var router = require("express").Router();
  
    // Create a new NotaRemisionCompra
    router.post("/", nota_remision_compra.create);
  
    // Retrieve all NotaRemisionCompra
    router.get("/", nota_remision_compra.findAll);
  
    // Retrieve a single NotaRemisionCompra with id
    router.get("/:id", nota_remision_compra.findOne);
  
    // Update a NotaRemisionCompra with id
    router.put("/:id", nota_remision_compra.update);
  
    // Delete a NotaRemisionCompra with id
    router.delete("/:id", nota_remision_compra.delete);
  
    app.use('/api/nota_remision_compra', router);
  };