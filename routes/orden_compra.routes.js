module.exports = app => {
  const orden_compra = require("../controllers/orden_compra.controller.js");

  var router = require("express").Router();

  // Create a new orden_compra
  router.post("/", orden_compra.create);

  // Retrieve all orden_compra
  router.get("/", orden_compra.findAll);

  // Retrieve a single orden_compra with id
  router.get("/:id", orden_compra.findOne);

  // Update a orden_compra with id
  router.put("/:id", orden_compra.update);

  // Delete a orden_compra with id
  router.delete("/:id", orden_compra.delete);

  app.use('/api/orden_compra', router);
};