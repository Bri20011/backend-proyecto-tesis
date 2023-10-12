const Proveedor = require("../models/proveedor.model.js");

// Create and Save a new Proveedor
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Proveedor
    const proveedor = new Proveedor({
        idProveedor: req.body.idProveedor,
        Ruc: req.body.Ruc,
        Razon_social: req.body.Razon_social,
        Direccion: req.body.Direccion,
        Telefono: req.body.Telefono,
        idBarrio: req.body.idBarrio,
        idCiudad: req.body.idCiudad
    });

    // Save Proveedor in the database
    Proveedor.create(proveedor, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar proveedor"
            });
        else res.send(data);
    });
};

// Retrieve all Proveedor from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idProveedor;

    Proveedor.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener proveedor"
            });
        else res.send(data);
    });
};

// Find a single Proveedor with a id
exports.findOne = (req, res) => {
    Proveedor.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro proveedor con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener proveedor con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a Proveedor identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Proveedor.updateById(
        req.params.id,
        new Proveedor(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Proveedor with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Proveedor with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Proveedor with the specified id in the request
exports.delete = (req, res) => {
    Proveedor.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Proveedor with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Proveedor with id " + req.params.id
                });
            }
        } else res.send({ message: `Proveedor was deleted successfully!` });
    });
};
