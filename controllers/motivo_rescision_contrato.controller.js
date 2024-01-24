const MotivoRescision = require("../models/motivo_rescision_contrato.model.js");

// Create and Save a new MotivoRescision
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a MotivoRescision
    const motivorescision = new MotivoRescision({
        idmotivo_rescision_contrato: req.body.idmotivo_rescision_contrato,
        Descripcion: req.body.Descripcion
    });

    // Save MotivoRescision in the database
    MotivoRescision.create(motivorescision, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar motivorescision"
            });
        else res.send(data);
    });
};

// Retrieve all MotivoRescision from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idmotivo_rescision_contrato;

    MotivoRescision.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener motivorescision"
            });
        else res.send(data);
    });
};

// Find a single MotivoRescision with a id
exports.findOne = (req, res) => {
    MotivoRescision.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro motivorescision con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener motivorescision con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a MotivoRescision identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    MotivoRescision.updateById(
        req.params.id,
        new MotivoRescision(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found MotivoRescision with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating MotivoRescision with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a MotivoRescision with the specified id in the request
exports.delete = (req, res) => {
    MotivoRescision.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found MotivoRescision with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete MotivoRescision with id " + req.params.id
                });
            }
        } else res.send({ message: `MotivoRescision was deleted successfully!` });
    });
};
