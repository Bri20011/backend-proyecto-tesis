module.exports = app => {
    const compras = require("../controllers/compras.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Compras
    router.post("/", compras.create);
  
    // Retrieve all Compras
    router.get("/", compras.findAll);

      //Obtener Libro Compras
    router.get("/librocompra", compras.librocompra);

    // Retrieve a single Compras with id
    router.get("/:id", compras.findOne);

    // Update a Compras with id
    router.put("/:id", compras.update);
  
    // Delete a Compras with id
    router.delete("/:id", compras.delete);
  
    app.use('/api/compras', router);
  };