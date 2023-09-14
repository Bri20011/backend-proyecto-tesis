module.exports = app => {
    const pedido = require("../controllers/pedido.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Pedido
    router.post("/", pedido.create);
  
    // Retrieve all Pedido
    router.get("/", pedido.findAll);
  
    // Retrieve a single Pedido with id
    router.get("/:id", pedido.findOne);
  
    // Update a Pedido with id
    router.put("/:id", pedido.update);
  
    // Delete a Pedido with id
    router.delete("/:id", pedido.delete);
  
    app.use('/api/pedido', router);
  };