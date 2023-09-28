const Caja = require("../models/caja.model.js");

// Create and Save a new Caja
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Caja
    const caja = new Caja({
        idCaja: req.body.idCaja,
        nombrecaja: req.body.nombrecaja,
        Cajahabilitada: req.body.Cajahabilitada,
        idSucursal: req.body.idSucursal
    });

    // Save Caja in the database
    Caja.create(caja, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar caja"
            });
        else res.send(data);
    });
};

// Retrieve all Caja from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idCaja;

    Caja.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener caja"
            });
        else res.send(data);
    });
};

// Find a single Caja with a id
exports.findOne = (req, res) => {
    Caja.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro caja con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener caja con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a Caja identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Caja.updateById(
        req.params.id,
        new Caja(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Caja with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Caja with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Caja with the specified id in the request
exports.delete = (req, res) => {
    Caja.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Caja with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Caja with id " + req.params.id
                });
            }
        } else res.send({ message: `Caja was deleted successfully!` });
    });
};
