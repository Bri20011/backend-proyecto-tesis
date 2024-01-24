const Cliente = require("../models/cliente.model.js");

// Create and Save a new Cliente
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Cliente
    const cliente = new Cliente({
        idCliente: req.body.idCliente,
        Ruc: req.body.Ruc,
        Razon_social: req.body.Razon_social,
        Direccion: req.body.Direccion,
        Telefono: req.body.Telefono,
        idCiudad: req.body.idCiudad,
        idBarrio: req.body.idBarrio
    });

    // Save Cliente in the database
    Cliente.create(cliente, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar cliente"
            });
        else res.send(data);
    });
};

// Retrieve all Cliente from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idCliente;

    Cliente.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener cliente"
            });
        else res.send(data);
    });
};

// Find a single Cliente with a id
exports.findOne = (req, res) => {
    Cliente.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro cliente con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener cliente con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a Cliente identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Cliente.updateById(
        req.params.id,
        new Cliente(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found cliente with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating cliente with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Cliente with the specified id in the request
exports.delete = (req, res) => {
    Cliente.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Cliente with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Cliente with id " + req.params.id
                });
            }
        } else res.send({ message: `Cliente was deleted successfully!` });
    });
};
