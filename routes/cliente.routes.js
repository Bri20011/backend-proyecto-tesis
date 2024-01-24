module.exports = app => {
    const cliente = require("../controllers/cliente.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Cliente
    router.post("/", cliente.create);
  
    // Retrieve all Cliente
    router.get("/", cliente.findAll);
  
    // Retrieve a single Cliente with id
    router.get("/:id", cliente.findOne);
  
    // Update a Cliente with id
    router.put("/:id", cliente.update);
  
    // Delete a Cliente with id
    router.delete("/:id", cliente.delete);
  
    app.use('/api/cliente', router);
  };