module.exports = app => {
    const sucursal = require("../controllers/sucursal.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Sucursal 
    router.post("/", sucursal.create);
  
    // Retrieve all Sucursal
    router.get("/", sucursal.findAll);
  
    // Retrieve a single Sucursal with id
    router.get("/:id", sucursal.findOne);
  
    // Update a Sucursal with id
    router.put("/:id", sucursal.update);
  
    // Delete a Sucursal with id
    router.delete("/:id", sucursal.delete);
  
    app.use('/api/sucursal', router);
  };