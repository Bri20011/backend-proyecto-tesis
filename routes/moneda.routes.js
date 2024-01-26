module.exports = app => {
    const moneda = require("../controllers/moneda.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Moneda
    router.post("/", moneda.create);
  
    // Retrieve all Moneda
    router.get("/", moneda.findAll);
  
    // Retrieve a single Moneda with id
    router.get("/:id", moneda.findOne);
  
    // Update a Moneda with id
    router.put("/:id", moneda.update);
  
    // Delete a Moneda with id
    router.delete("/:id", moneda.delete);
  
    app.use('/api/moneda', router);
  };