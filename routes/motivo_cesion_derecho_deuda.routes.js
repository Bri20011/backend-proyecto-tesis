module.exports = app => {
    const motivo_cesion_derecho_deuda = require("../controllers/motivo_cesion_derecho_deuda.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Motivo Cesion
    router.post("/", motivo_cesion_derecho_deuda.create);
  
    // Retrieve all Motivo Cesion
    router.get("/", motivo_cesion_derecho_deuda.findAll);
  
    // Retrieve a single Motivo Cesion with id
    router.get("/:id", motivo_cesion_derecho_deuda.findOne);
  
    // Update a Motivo Cesion with id
    router.put("/:id", motivo_cesion_derecho_deuda.update);
  
    // Delete a Motivo Cesion with id
    router.delete("/:id", motivo_cesion_derecho_deuda.delete);
  
    app.use('/api/motivo_cesion_derecho_deuda', router);
  };