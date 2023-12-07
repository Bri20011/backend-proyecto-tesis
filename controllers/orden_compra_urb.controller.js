const Orden_Compra_Urb = require("../models/orden_compra_urb.model.js");

// Create and Save a new Orden_Compra_Urb
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Orden_Compra_Urb
    const orden_compra_urb = new Orden_Compra_Urb({
        idOrden_Compra_Urb: req.body.idOrden_Compra_Urb,
        Descripcion: req.body.Descripcion,
        Fecha_pedi: req.body.Fecha_pedi,
        PrecioT: req.body.PrecioT,
        idProveedor: req.body.idProveedor,
        Detalle: req.body.Detalle

    });

    // Save Orden_Compra_Urb in the database
    Orden_Compra_Urb.create(orden_compra_urb, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar Orden_Compra_Urb"
            });
        else res.send(data);
    });
};

// Retrieve all Orden_Compra_Urb from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idOrden_Compra_Urb;

    Orden_Compra_Urb.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener orden_compra_urb"
            });
        else res.send(data);
    });
};

// Find a single Orden_Compra_Urb with a id
exports.findOne = (req, res) => {
    orden_compra_urb.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro orden_compra_urb con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener orden_compra_urb con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a Orden_Compra_Urb identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Orden_Compra_Urb.updateById(
        req.params.id,
        new Orden_Compra(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found orden_compra with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating orden_compra with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Orden_Compra_Urb with the specified id in the request
exports.delete = (req, res) => {
    // Eliminar detalles de Orden_Compra_Urb primero
    Orden_Compra_Urb.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found ororden_compra_urbden_compra with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete orden_compra_urb with id " + req.params.id
                });
            }
        } else {
            res.send({ message: `orden_compra_urb was deleted successfully!` });
        }
    });
};