const Urbanizacion = require("../models/urbanizacion.model.js");

// Create and Save a new Urbanizacion
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Urbanizacion
    const urbanizacion = new Urbanizacion({
        idUrbanizacion: req.body.idUrbanizacion,
        fecha_urb: req.body.fecha_urb,
        Nombre_Urbanizacion: req.body.Nombre_Urbanizacion,
        Area: req.body.Area,
        LadoA: req.body.LadoA,
        LadoB: req.body.LadoB,
        Cantidad_manzana: req.body.Cantidad_manzana,
        Ubicacion: req.body.Ubicacion,
        Precio: req.body.Precio,
        idCiudad: req.body.idCiudad,
        Detalle: req.body.Detalle

    });

    // Save Urbanizacion in the database
    Urbanizacion.create(urbanizacion, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar Urbanizacion"
            });
        else res.send(data);
    });
};

// Retrieve all Urbanizacion from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idUrbanizacion;

    Urbanizacion.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener Urbanizacion"
            });
        else res.send(data);
    });
};

// Find a single Urbanizacion with a id
exports.findOne = (req, res) => {
    Urbanizacion.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro compra con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener compra con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a Urbanizacion identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Urbanizacion.update(
        req.params.id,
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found compra with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating compra with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Urbanizacion with the specified id in the request
exports.delete = (req, res) => {
    // Eliminar detalles de urbanizacion primero
    Urbanizacion.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found urbanizacion with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete urbanizacion with id " + req.params.id
                });
            }
        } else {
            res.send({ message: `urbanizacion was deleted successfully!` });
        }
    });
};