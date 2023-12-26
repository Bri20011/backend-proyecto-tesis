module.exports = app => {
    const stock = require("../controllers/stock.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Stock
    router.post("/", stock.create);
  
    // Retrieve all Stock
    router.get("/", stock.findAll);

    router.get('/obtener-por-tipo/:idStock', stock.findByTipo);
  
    // Retrieve a single Stock with id
    router.get("/:id", stock.findOne);
  
    // Update a Stock with id
    router.put("/:id", stock.update);
  
    // Delete a Stock with id
    router.delete("/:id", stock.delete);
  
    app.use('/api/stock', router);
  };