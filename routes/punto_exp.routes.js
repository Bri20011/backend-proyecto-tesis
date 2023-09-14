module.exports = app => {
    const punto_exp = require("../controllers/punto_exp.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Punto_exp
    router.post("/", punto_exp.create);
  
    // Retrieve all Punto_exp
    router.get("/", punto_exp.findAll);
  
    // Retrieve a single Punto_exp with id
    router.get("/:id", punto_exp.findOne);
  
    // Update a Punto_exp with id
    router.put("/:id", punto_exp.update);
  
    // Delete a Punto_exp with id
    router.delete("/:id", punto_exp.delete);
  
    app.use('/api/punto_exp', router);
  };