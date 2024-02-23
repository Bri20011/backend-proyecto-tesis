module.exports = app => {
  const orde_compra_lote = require("../controllers/orde_compra_lote.controller.js");

  var router = require("express").Router();

  // Create a new orde_compra_lote
  router.post("/", orde_compra_lote.create);

  // Retrieve all orde_compra_lote
  router.get("/", orde_compra_lote.findAll);

  // Retrieve a single orde_compra_lote with id
  router.get("/:id", orde_compra_lote.findOne);

  // Update a orde_compra_lote with id
  router.put("/:id", orde_compra_lote.update);

  // Delete a orde_compra_lote with id
  router.delete("/:id", orde_compra_lote.delete);

  app.use('/api/orde_compra_lote', router);
};