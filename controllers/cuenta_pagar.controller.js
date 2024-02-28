const CuentaPagar = require("../models/cuenta_pagar.model.js");

// Create and Save a new CuentaPagar
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a CuentaPagar
    const cuenta_pagar = new CuentaPagar({
        idcuenta_pagar: req.body.idcuenta_pagar,
        proveedor: req.body.proveedor,
        observacion: req.body.observacion,
        Detalle: req.body.Detalle

    });

    // Save CuentaPagar in the database
    CuentaPagar.create(cuenta_pagar, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar CuentaPagar"
            });
        else res.send(data);
    });
};

// Retrieve all CuentaPagar from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idcuenta_pagar;

    CuentaPagar.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener CuentaPagar"
            });
        else res.send(data);
    });
};

// Find a single CuentaPagar with a id
exports.findOne = (req, res) => {
    CuentaPagar.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro compra con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener compra con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};




