module.exports = app => {
    const barrio = require("../controllers/barrio.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Ciudad
    router.post("/", barrio.create);
  
    // Retrieve all Ciudad
    router.get("/", barrio.findAll);
  
    // Retrieve a single Ciudad with id
    router.get("/:id", barrio.findOne);
  
    // Update a Ciudad with id
    router.put("/:id", barrio.update);
  
    // Delete a Ciudad with id
    router.delete("/:id", barrio.delete);
  
    app.use('/api/barrio', router);
  };