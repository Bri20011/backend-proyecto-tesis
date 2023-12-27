module.exports = app => {
    const manzana = require("../controllers/manzana.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Manzana
    router.post("/", manzana.create);
  
    // Retrieve all Manzana
    router.get("/", manzana.findAll);
  
    // Retrieve a single Manzana with id
    router.get("/:id", manzana.findOne);
  
    // Update a Manzana with id
    router.put("/:id", manzana.update);
  
    // Delete a Manzana with id
    router.delete("/:id", manzana.delete);
  
    app.use('/api/manzana', router);
  };