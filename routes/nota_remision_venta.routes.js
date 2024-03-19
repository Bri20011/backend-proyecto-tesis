module.exports = app => {
    const nota_remision_venta = require("../controllers/nota_remision_venta.controller.js");
  
    var router = require("express").Router();
  
    // Create a new NotaRemisionVenta
    router.post("/", nota_remision_venta.create);
  
    // Retrieve all NotaRemisionVenta
    router.get("/", nota_remision_venta.findAll);
  
    // Retrieve a single NotaRemisionVenta with id
    router.get("/:id", nota_remision_venta.findOne);
  
    // Update a NotaRemisionVenta with id
    router.put("/:id", nota_remision_venta.update);
  
    // Delete a NotaRemisionVenta with id
    router.delete("/:id", nota_remision_venta.delete);
  
    app.use('/api/nota_remision_venta', router);
  };