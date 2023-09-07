module.exports = app => {
    const categoria = require("../controllers/categoria.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Ciudad
    router.post("/", categoria.create);
  
    // Retrieve all Ciudad
    router.get("/", categoria.findAll);
  
    // Retrieve a single Ciudad with id
    router.get("/:id", categoria.findOne);
  
    // Update a Ciudad with id
    router.put("/:id", categoria.update);
  
    // Delete a Ciudad with id
    router.delete("/:id", categoria.delete);
  
    app.use('/api/categoria', router);
  };