module.exports = app => {
    const compras_lote = require("../controllers/compras_lote.controller.js");
  
    var router = require("express").Router();
  
    // Create a new compras_lote
    router.post("/", compras_lote.create);
  
    // Retrieve all compras_lote
    router.get("/", compras_lote.findAll);
  
    // Retrieve a single compras_lote with id
    router.get("/:id", compras_lote.findOne);
  
    // Update a compras_lote with id
    router.put("/:id", compras_lote.update);
  
    // Delete a compras_lote with id
    router.delete("/:id", compras_lote.delete);
  
    app.use('/api/compras_lote', router);
  };