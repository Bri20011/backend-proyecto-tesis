module.exports = app => {
    const efectivo = require("../controllers/efectivo.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Efectivo
    router.post("/", efectivo.create);
  
    // Retrieve all Efectivo
    router.get("/", efectivo.findAll);
  
    // Retrieve a single Efectivo with id
    router.get("/:id", efectivo.findOne);
  
    // Update a Efectivo with id
    router.put("/:id", efectivo.update);
  
    // Delete a Efectivo with id
    router.delete("/:id", efectivo.delete);
  
    app.use('/api/efectivo', router);
  };