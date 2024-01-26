module.exports = app => {
    const forma_cobro = require("../controllers/forma_cobro.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Forma Cobro
    router.post("/", forma_cobro.create);
  
    // Retrieve all Forma Cobro
    router.get("/", forma_cobro.findAll);
  
    // Retrieve a single MForma Cobro with id
    router.get("/:id", forma_cobro.findOne);
  
    // Update a Forma Cobro with id
    router.put("/:id", forma_cobro.update);
  
    // Delete a Forma Cobro with id
    router.delete("/:id", forma_cobro.delete);
  
    app.use('/api/forma_cobro', router);
  };