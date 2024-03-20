module.exports = app => {
    const apertura = require("../controllers/apertura.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Apertura
    router.post("/", apertura.create);
  
    // Retrieve all Apertura
    router.get("/", apertura.findAll);
  
    // Retrieve a single Apertura with id
    router.get("/:id", apertura.findOne);
  
    // Update a Apertura with id
    router.put("/:id", apertura.update);
  
    // Delete a Apertura with id
    router.delete("/:id", apertura.delete);
  
    app.use('/api/apertura', router);
  };