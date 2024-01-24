module.exports = app => {
    const nivel = require("../controllers/nivel.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Nivel
    router.post("/", nivel.create);
  
    // Retrieve all Nivel
    router.get("/", nivel.findAll);
  
    // Retrieve a single Nivel with id
    router.get("/:id", nivel.findOne);
  
    // Update a Nivel with id
    router.put("/:id", nivel.update);
  
    // Delete a Nivel with id
    router.delete("/:id", nivel.delete);
  
    app.use('/api/nivel', router);
  };