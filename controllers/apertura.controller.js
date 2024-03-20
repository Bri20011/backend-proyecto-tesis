const Apertura = require("../models/apertura.model.js");

// Create and Save a new Apertura
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Apertura
    const apertura = new Apertura({
        idAperturacaja: req.body.idAperturacaja,
        Fechahoraapertura: req.body.Fechahoraapertura,
        Monto_Inicial: req.body.Monto_Inicial,
        idCaja: req.body.idCaja,
        idUsuario: req.body.idUsuario,
    });

    // Save Apertura in the database
    Apertura.create(apertura, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar apertura"
            });
        else res.send(data);
    });
};

// Retrieve all Apertura from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idAperturacaja;

    Apertura.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener apertura"
            });
        else res.send(data);
    });
};

// Find a single Apertura with a id
exports.findOne = (req, res) => {
    Apertura.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro apertura con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener apertura con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a Apertura identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Apertura.updateById(
        req.params.id,
        new Apertura(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Apertura with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Apertura with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Apertura with the specified id in the request
exports.delete = (req, res) => {
    Apertura.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Apertura with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Apertura with id " + req.params.id
                });
            }
        } else res.send({ message: `Apertura was deleted successfully!` });
    });
};
