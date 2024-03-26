module.exports = app => {
    const cierre = require("../controllers/cierre.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Cierre
    router.post("/", cierre.create);
  
    // Retrieve all Cierre
    router.get("/", cierre.findAll);
  
    // Retrieve a single Cierre with id
    router.get("/:id", cierre.findOne);
  
    // Update a Cierre with id
    router.put("/:id", cierre.update);
  
    // Delete a Cierre with id
    router.delete("/:id", cierre.delete);
  
    app.use('/api/cierre', router);
  };