module.exports = app => {
    const urbanizacion = require("../controllers/urbanizacion.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Urbanizacion
    router.post("/", urbanizacion.create);
  
    // Retrieve all Urbanizacion
    router.get("/", urbanizacion.findAll);
  
    // Retrieve a single Urbanizacion with id
    router.get("/:id", urbanizacion.findOne);
  
    // Update a Urbanizacion with id
    router.put("/:id", urbanizacion.update);
  
    // Delete a Urbanizacion with id
    router.delete("/:id", urbanizacion.delete);
  
    app.use('/api/urbanizacion', router);
  };