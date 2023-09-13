const Orden_Compra = require("../models/orden_compra.model.js");

// Create and Save a new Orden_Compra
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Orden_Compra
    const orden_compra = new Orden_Compra({
        idorden_compra: req.body.idorden_compra,
        Descripcion: req.body.Descripcion
    });

    // Save Orden_Compra in the database
    Orden_Compra.create(orden_compra, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar orden_compra"
            });
        else res.send(data);
    });
};

// Retrieve all Orden_Compra from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idorden_compra;

    Orden_Compra.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener orden_compra"
            });
        else res.send(data);
    });
};

// Find a single Orden_Compra with a id
exports.findOne = (req, res) => {
    Orden_Compra.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro orden_compra con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener orden_compra con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a Orden_Compra identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Orden_Compra.updateById(
        req.params.id,
        new Orden_Compra(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Orden_Compra with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Orden_Compra with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Orden_Compra with the specified id in the request
exports.delete = (req, res) => {
    Orden_Compra.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Orden_Compra with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Orden_Compra with id " + req.params.id
                });
            }
        } else res.send({ message: `Orden_Compra was deleted successfully!` });
    });
};
