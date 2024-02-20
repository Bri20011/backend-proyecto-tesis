module.exports = app => {
    const stock_lote = require("../controllers/stock_lote.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Stock_lote
    router.post("/", stock_lote.create);
  
    // Retrieve all Stock_lote
    router.get("/", stock_lote.findAll);

    router.get('/obtener-por-tipo/:idStock_Lote', stock_lote.findByTipo);
  
    // Retrieve a single sStock_lotetock_lote with id
    router.get("/:id", stock_lote.findOne);
  
    // Update a Stock_lote with id
    router.put("/:id", stock_lote.update);
  
    // Delete a Stock_lote with id
    router.delete("/:id", stock_lote.delete);
  
    app.use('/api/stock_lote', router);
  };