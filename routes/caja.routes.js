module.exports = app => {
    const caja = require("../controllers/caja.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Caja
    router.post("/", caja.create);
  
    // Retrieve all Caja
    router.get("/", caja.findAll);
  
    // Retrieve a single Caja with id
    router.get("/:id", caja.findOne);
  
    // Update a Caja with id
    router.put("/:id", caja.update);
  
    // Delete a Caja with id
    router.delete("/:id", caja.delete);
  
    app.use('/api/caja', router);
  };