const MotivoCesion = require("../models/motivo_cesion_derecho_deuda.model.js");

// Create and Save a new MotivoCesion
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a MotivoCesion 
    const motivocesion = new MotivoCesion({
        idmotivo_cesion_derecho_deuda: req.body.idmotivo_cesion_derecho_deuda,
        Descripcion: req.body.Descripcion
    });

    // Save MotivoCesion in the database
    MotivoCesion.create(motivocesion, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar motivocesion"
            });
        else res.send(data);
    });
};

// Retrieve all MotivoCesion from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idmotivo_cesion_derecho_deuda;

    MotivoCesion.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener motivocesion"
            });
        else res.send(data);
    });
};

// Find a single MotivoCesion with a id
exports.findOne = (req, res) => {
    MotivoCesion.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro motivocesion con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener motivocesion con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a MotivoCesion identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    MotivoCesion.updateById(
        req.params.id,
        new MotivoCesion(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found MotivoCesion with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating MotivoCesion with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a MotivoCesion with the specified id in the request
exports.delete = (req, res) => {
    MotivoCesion.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found MotivoCesion with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete MotivoCesion with id " + req.params.id
                });
            }
        } else res.send({ message: `MotivoCesion was deleted successfully!` });
    });
};
