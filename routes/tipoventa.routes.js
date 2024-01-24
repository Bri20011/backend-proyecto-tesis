module.exports = app => {
    const tipoventa = require("../controllers/tipoventa.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tipo Venta
    router.post("/", tipoventa.create);
  
    // Retrieve all Tipo Venta
    router.get("/", tipoventa.findAll);
  
    // Retrieve a single Tipo Venta with id
    router.get("/:id", tipoventa.findOne);
  
    // Update a Tipo Venta with id
    router.put("/:id", tipoventa.update);
  
    // Delete a Tipo Venta with id
    router.delete("/:id", tipoventa.delete);
  
    app.use('/api/tipoventa', router);
  };