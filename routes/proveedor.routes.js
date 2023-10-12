module.exports = app => {
    const proveedor = require("../controllers/proveedor.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Proveedor
    router.post("/", proveedor.create);
  
    // Retrieve all Proveedor
    router.get("/", proveedor.findAll);
  
    // Retrieve a single Proveedor with id
    router.get("/:id", proveedor.findOne);
  
    // Update a Proveedor with id
    router.put("/:id", proveedor.update);
  
    // Delete a Proveedor with id
    router.delete("/:id", proveedor.delete);
  
    app.use('/api/proveedor', router);
  };