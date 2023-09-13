module.exports = app => {
    const orden_compra = require("../controllers/orden_compra.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Orden_Compra
    router.post("/", orden_compra.create);
  
    // Retrieve all Orden_Compra
    router.get("/", orden_compra.findAll);
  
    // Retrieve a single Orden_Compra with id
    router.get("/:id", orden_compra.findOne);
  
    // Update a Orden_Compra with id
    router.put("/:id", orden_compra.update);
  
    // Delete a Orden_Compra with id
    router.delete("/:id", orden_compra.delete);
  
    app.use('/api/orden_compra', router);
  };