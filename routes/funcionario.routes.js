module.exports = app => {
    const funcionario = require("../controllers/funcionario.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Funcionario
    router.post("/", funcionario.create);
  
    // Retrieve all Funcionario
    router.get("/", funcionario.findAll);
  
    // Retrieve a single Funcionario with id
    router.get("/:id", funcionario.findOne);
  
    // Update a Funcionario with id
    router.put("/:id", funcionario.update);
  
    // Delete a Funcionario with id
    router.delete("/:id", funcionario.delete);
  
    app.use('/api/funcionario', router);
  };