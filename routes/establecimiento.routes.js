module.exports = app => {
    const establecimiento = require("../controllers/establecimiento.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Establecimiento
    router.post("/", establecimiento.create);
  
    // Retrieve all Establecimiento
    router.get("/", establecimiento.findAll);
  
    // Retrieve a single Establecimiento with id
    router.get("/:id", establecimiento.findOne);
  
    // Update a Establecimiento with id
    router.put("/:id", establecimiento.update);
  
    // Delete a Establecimiento with id
    router.delete("/:id", establecimiento.delete);
  
    app.use('/api/establecimiento', router);
  };