module.exports = app => {
    const orden_compra_urb = require("../controllers/orden_compra_urb.controller.js");
  
    var router = require("express").Router();
  
    // Create a new   Orden_Compra_Urb
    router.post("/", orden_compra_urb.create);
  
    // Retrieve all   Orden_Compra_Urb
    router.get("/", orden_compra_urb.findAll);
  
    // Retrieve a single   Orden_Compra_Urb with id
    router.get("/:id", orden_compra_urb.findOne);
  
    // Update a   Orden_Compra_Urb with id
    router.put("/:id", orden_compra_urb.update);
  
    // Delete a   Orden_Compra_Urb with id
    router.delete("/:id", orden_compra_urb.delete);
  
    app.use('/api/orden_compra_urb', router);
    
  };

