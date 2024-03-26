const Cierre = require("../models/cierre.model.js");

// Create and Save a new Cierre
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Cierre
    const cierre = new Cierre({
        idCierre_caja: req.body.idCierre_caja,
        monto_final: req.body.monto_final,
        idAperturacaja: req.body.idAperturacaja,
        monto_apertura: req.body.monto_apertura,
        fecha_hora_apertura: req.body.fecha_hora_apertura,
    });

    // Save Cierre in the database
    Cierre.create(cierre, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar cierre"
            });
        else res.send(data);
    });
};

// Retrieve all Cierre from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idCierre_caja;

    Cierre.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener cierre"
            });
        else res.send(data);
    });
};

// Find a single Cierre with a id
exports.findOne = (req, res) => {
    Cierre.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro cierre con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener cierre con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a Cierre identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Cierre.updateById(
        req.params.id,
        new Cierre(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Cierre with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Cierre with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Cierre with the specified id in the request
exports.delete = (req, res) => {
    Cierre.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Cierre with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Cierre with id " + req.params.id
                });
            }
        } else res.send({ message: `Cierre was deleted successfully!` });
    });
};
