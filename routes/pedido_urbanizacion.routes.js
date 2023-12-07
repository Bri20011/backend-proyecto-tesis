module.exports = app => {
    const pedido_urbanizacion = require("../controllers/pedido_urbanizacion.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Pedido
    router.post("/", pedido_urbanizacion.create);
  
    // Retrieve all Pedido
    router.get("/", pedido_urbanizacion.findAll);
  
    // Retrieve a single Pedido with id
    router.get("/:id", pedido_urbanizacion.findOne);
  
    // Update a Pedido with id
    router.put("/:id", pedido_urbanizacion.update);
  
    // Delete a Pedido with id
    router.delete("/:id", pedido_urbanizacion.delete);
  
    app.use('/api/pedido_urbanizacion', router);
  };