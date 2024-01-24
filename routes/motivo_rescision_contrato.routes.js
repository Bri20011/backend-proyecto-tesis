module.exports = app => {
    const motivo_rescision_contrato = require("../controllers/motivo_rescision_contrato.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Motivo Rescisión
    router.post("/", motivo_rescision_contrato.create);
  
    // Retrieve all Motivo Rescisión
    router.get("/", motivo_rescision_contrato.findAll);
  
    // Retrieve a single Motivo Rescisión with id
    router.get("/:id", motivo_rescision_contrato.findOne);
  
    // Update a Motivo Rescisión with id
    router.put("/:id", motivo_rescision_contrato.update);
  
    // Delete a Motivo Rescisión with id
    router.delete("/:id", motivo_rescision_contrato.delete);
  
    app.use('/api/motivo_rescision_contrato', router);
  };