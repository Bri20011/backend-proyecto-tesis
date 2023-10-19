module.exports = app => {
    const producto = require("../controllers/producto.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Producto
    router.post("/", producto.create);
  
    // Retrieve all Producto
    router.get("/", producto.findAll);
  
    // Retrieve a single Producto with id
    router.get("/:id", producto.findOne);
  
    // Update a Producto with id
    router.put("/:id", producto.update);
  
    // Delete a Producto with id
    router.delete("/:id", producto.delete);
  
    app.use('/api/producto', router);
  };