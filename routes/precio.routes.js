module.exports = app => {
    const precio = require("../controllers/precio.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Precio
    router.post("/", precio.create);
  
    // Retrieve all Precio
    router.get("/", precio.findAll);
  
    // Retrieve a single Precio with id
    router.get("/:id", precio.findOne);
  
    // Update a Precio with id
    router.put("/:id", precio.update);
  
    // Delete a Precio with id
    router.delete("/:id", precio.delete);
  
    app.use('/api/precio', router);
  };