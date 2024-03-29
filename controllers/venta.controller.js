const Ventas = require("../models/venta.model.js");
const webAPdf = require('./ventas/webAPdf.js');

// Create and Save a new Ventas
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Ventas
    const venta = new Ventas({
        idventa: req.body.idventa,
        Fecha: req.body.Fecha,
        Numero_fact: req.body.Numero_fact,
        idtipo_venta: req.body.idtipo_venta,
        idCliente: req.body.idCliente,
        idTimbrado: req.body.idTimbrado,
        idAperturacaja: req.body.idAperturacaja,
        idCaja: req.body.idCaja,
        Detalle: req.body.detalle,
        // CuentaPagar: req.body.CuentaPagar

    });

    // Save Ventas in the database
    Ventas.create(venta, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar Ventas"
            });
        else res.send(data);
    });
};

// Retrieve all Ventas from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idventa;

    Ventas.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener Ventas"
            });
        else res.send(data);
    });
};

exports.obtenerNumeroFactura = (req, res) => {
    const id = req.params?.id;

    Ventas.obtenerNumeroFactura(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener Ventas"
            });
        else res.send(data);
    });
};


exports.libroventa = (req, res) => {
    const id = req.params?.id;

    Ventas.libroventa(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener libro de ventas"
            });
        else res.send(data);
    });
};

exports.descargarFactura = (req, res) => {
    const id = req.params?.id;

    Ventas.descargarFactura(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener Ventas"
            });
        else {
            const urlParams = encodeURIComponent(JSON.stringify(data));
            webAPdf.generatePdfBase64FromHtml(`/generarFactura?data=${urlParams}`).then((pdf) => {
                console.log(`http://localhost:3000/generarFactura?data=${urlParams}`)
                res.send(pdf);
            });
            // res.send(data);
        }
    });
};

// Find a single Ventas with a id
exports.findOne = (req, res) => {
    Ventas.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro venta con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener venta con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a Ventas identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Ventas.update(
        req.params.id,
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found venta with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating venta with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Ventas with the specified id in the request
exports.delete = (req, res) => {
    // Eliminar detalles de venta primero
    Ventas.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found venta with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete venta with id " + req.params.id
                });
            }
        } else {
            res.send({ message: `venta was deleted successfully!` });
        }
    });
};