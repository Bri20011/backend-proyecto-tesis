module.exports = app => {
    const tipo_documento = require("../controllers/tipo_documento.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tipo_Documento
    router.post("/", tipo_documento.create);
  
    // Retrieve all Tipo_Documento
    router.get("/", tipo_documento.findAll);
  
    // Retrieve a single Tipo_Documento with id
    router.get("/:id", tipo_documento.findOne);
  
    // Update a Tipo_Documento with id
    router.put("/:id", tipo_documento.update);
  
    // Delete a Tipo_Documento with id
    router.delete("/:id", tipo_documento.delete);
  
    app.use('/api/tipo_documento', router);
  };