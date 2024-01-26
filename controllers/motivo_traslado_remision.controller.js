const MotivoTraslado = require("../models/motivo_traslado_remision.model.js");

// Create and Save a new MotivoTraslado
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a MotivoTraslado 
    const motivotraslado = new MotivoTraslado({
        idmotivo_traslado_remision: req.body.idmotivo_traslado_remision,
        Descripcion: req.body.Descripcion
    });

    // Save MotivoTraslado in the database
    MotivoTraslado.create(motivotraslado, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar motivotraslado"
            });
        else res.send(data);
    });
};

// Retrieve all MotivoTraslado from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idmotivo_traslado_remision;

    MotivoTraslado.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener motivotraslado"
            });
        else res.send(data);
    });
};

// Find a single MotivoTraslado with a id
exports.findOne = (req, res) => {
    MotivoTraslado.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro motivotraslado con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener motivotraslado con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a MotivoTraslado identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    MotivoTraslado.updateById(
        req.params.id,
        new MotivoTraslado(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found MotivoTraslado with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating MotivoTraslado with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a MotivoTraslado with the specified id in the request
exports.delete = (req, res) => {
    MotivoTraslado.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found MotivoTraslado with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete MotivoTraslado with id " + req.params.id
                });
            }
        } else res.send({ message: `MotivoTraslado was deleted successfully!` });
    });
};
