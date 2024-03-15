module.exports = app => {
    const venta = require("../controllers/venta.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Ventas
    router.post("/", venta.create);
  
    // Retrieve all Ventas
    router.get("/", venta.findAll);

    router.get("/numeroFactura/:id", venta.obtenerNumeroFactura);
  
    // Retrieve a single Ventas with id
    router.get("/:id", venta.findOne);
  
    // Update a Ventas with id
    router.put("/:id", venta.update);
  
    // Delete a Ventas with id
    router.delete("/:id", venta.delete);
  
    app.use('/api/venta', router);
  };