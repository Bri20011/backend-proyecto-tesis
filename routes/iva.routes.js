module.exports = app => {
    const iva = require("../controllers/iva.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Iva
    router.post("/", iva.create);
  
    // Retrieve all Iva
    router.get("/", iva.findAll);
  
    // Retrieve a single Iva with id
    router.get("/:id", iva.findOne);
  
    // Update a Iva with id
    router.put("/:id", iva.update);
  
    // Delete a Iva with id
    router.delete("/:id", iva.delete);
  
    app.use('/api/iva', router);
  };

  //