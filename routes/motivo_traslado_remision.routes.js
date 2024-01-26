module.exports = app => {
    const motivo_traslado_remision = require("../controllers/motivo_traslado_remision.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Motivo Traslado
    router.post("/", motivo_traslado_remision.create);
  
    // Retrieve all Motivo Traslado
    router.get("/", motivo_traslado_remision.findAll);
  
    // Retrieve a single Motivo Traslado with id
    router.get("/:id", motivo_traslado_remision.findOne);
  
    // Update a Motivo Traslado with id
    router.put("/:id", motivo_traslado_remision.update);
  
    // Delete a Motivo Traslado with id
    router.delete("/:id", motivo_traslado_remision.delete);
  
    app.use('/api/motivo_traslado_remision', router);
  };