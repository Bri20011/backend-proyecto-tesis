module.exports = app => {
  const presupuesto = require("../controllers/presupuesto.controller.js");

  var router = require("express").Router();

  // Create a new presupuesto
  router.post("/", presupuesto.create);

  // Retrieve all presupuesto
  router.get("/", presupuesto.findAll);

  // Retrieve a single presupuesto with id
  router.get("/:id", presupuesto.findOne);

  // Update a presupuesto with id
  router.put("/:id", presupuesto.update);

  // Delete a presupuesto with id
  router.delete("/:id", presupuesto.delete);

  app.use('/api/presupuesto', router);
};