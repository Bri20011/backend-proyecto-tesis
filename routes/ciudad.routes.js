module.exports = app => {
    const ciudad = require("../controllers/ciudad.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Ciudad
    router.post("/", ciudad.create);
  
    // Retrieve all Ciudad
    router.get("/", ciudad.findAll);
  
    // Retrieve a single Ciudad with id
    router.get("/:id", ciudad.findOne);
  
    // Update a Ciudad with id
    router.put("/:id", ciudad.update);
  
    // Delete a Ciudad with id
    router.delete("/:id", ciudad.delete);
  
    app.use('/api/ciudad', router);
  };