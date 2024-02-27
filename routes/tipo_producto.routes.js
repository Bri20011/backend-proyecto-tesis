module.exports = app => {
    const tipo_producto = require("../controllers/tipo_producto.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tipo Producto
    router.post("/", tipo_producto.create);
  
    // Retrieve all Tipo Producto
    router.get("/", tipo_producto.findAll);
  
    // Retrieve a single Tipo Producto with id
    router.get("/:id", tipo_producto.findOne);
  
    // Update a Tipo Producto with id
    router.put("/:id", tipo_producto.update);
  
    // Delete a Tipo Producto with id
    router.delete("/:id", tipo_producto.delete);
  
    app.use('/api/tipo_producto', router);
  };