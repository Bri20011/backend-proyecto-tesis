const Precio = require("../models/precio.model.js");

// Create and Save a new Precio
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Precio
    const precio = new Precio({
        idListado_precio: req.body.idListado_precio,
        Nombre_Urbanizacion: req.body.Nombre_Urbanizacion,
        fecha: req.body.fecha,
        Ubicacion: req.body.Ubicacion,
        idCiudad: req.body.idCiudad,
        idBarrio: req.body.idBarrio,
        Costo_total: req.body.Costo_total,
        idUrbanizacion: req.body.idUrbanizacion,  
        Detalle: req.body.Detalle


    });

    // Save Precio in the database
    Precio.create(precio, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar Listado"
            });
        else res.send(data);
    });
};

// Retrieve all Precio from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idListado_precio;

    Precio.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener Listado"
            });
        else res.send(data);
    });
};

// Find a single Precio with a id
exports.findOne = (req, res) => {
    Precio.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro Listado con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener Listado con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a Precio identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Precio.updateById(
        req.params.id,
        new Precio(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found listado with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating listado with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Precio with the specified id in the request
exports.delete = (req, res) => {
    // Eliminar detalles de Precio primero
    Precio.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Listado with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Listado with id " + req.params.id
                });
            }
        } else {
            res.send({ message: `Listado was deleted successfully!` });
        }
    });
};