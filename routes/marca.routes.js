module.exports = app => {
    const marca = require("../controllers/marca.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Marca
    router.post("/", marca.create);
  
    // Retrieve all Marca
    router.get("/", marca.findAll);
  
    // Retrieve a single Marca with id
    router.get("/:id", marca.findOne);
  
    // Update a Marca with id
    router.put("/:id", marca.update);
  
    // Delete a Marca with id
    router.delete("/:id", marca.delete);
  
    app.use('/api/marca', router);
  };