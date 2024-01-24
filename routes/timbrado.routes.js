module.exports = app => {
    const timbrado = require("../controllers/timbrado.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Timbrado
    router.post("/", timbrado.create);
  
    // Retrieve all Timbrado
    router.get("/", timbrado.findAll);
  
    // Retrieve a single Timbrado with id
    router.get("/:id", timbrado.findOne);
  
    // Update a Timbrado with id
    router.put("/:id", timbrado.update);
  
    // Delete a Timbrado with id
    router.delete("/:id", timbrado.delete);
  
    app.use('/api/timbrado', router);
  };