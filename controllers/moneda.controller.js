const Moneda = require("../models/moneda.model.js");

// Create and Save a new Moneda
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Moneda
    const moneda = new Moneda({
        idmoneda: req.body.idmoneda,
        Descripcion: req.body.Descripcion
    });

    // Save Moneda in the database
    Moneda.create(moneda, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar moneda"
            });
        else res.send(data);
    });
};

// Retrieve all Moneda from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idmoneda;

    Moneda.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener moneda"
            });
        else res.send(data);
    });
};

// Find a single Moneda with a id
exports.findOne = (req, res) => {
    Moneda.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro moneda con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener moneda con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a Moneda identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Moneda.updateById(
        req.params.id,
        new Moneda(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Moneda with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Moneda with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Moneda with the specified id in the request
exports.delete = (req, res) => {
    Moneda.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Moneda with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Moneda with id " + req.params.id
                });
            }
        } else res.send({ message: `Moneda was deleted successfully!` });
    });
};
