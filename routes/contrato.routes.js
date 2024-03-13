module.exports = app => {
    const contrato = require("../controllers/contrato.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Contrato
    router.post("/", contrato.create);
  
    // Retrieve all Contrato
    router.get("/", contrato.findAll);
  
    // Retrieve a single Contrato with id
    router.get("/:id", contrato.findOne);
  
    // Update a Contrato with id
    router.put("/:id", contrato.update);
  
    // Delete a Contrato with id
    router.delete("/:id", contrato.delete);
  
    app.use('/api/contrato', router);
  };