const sql = require("../db.js");


// constructord
const Orden_Compra_Urbanizacion = function (orde_compra_lote) {
    this.idorde_compra_lote = orde_compra_lote.idorde_compra_lote;
    this.descripcion = orde_compra_lote.descripcion;
    this.fecha = orde_compra_lote.fecha;
    this.Detalle = orde_compra_lote.Detalle;
};

Orden_Compra_Urbanizacion.create = (newOrdenCompraUrb, result) => {
    sql.query("SELECT idorde_compra_lote as id FROM orde_compra_lote ORDER BY idorde_compra_lote DESC LIMIT 1", null, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO orde_compra_lote (idorde_compra_lote, descripcion, fecha) VALUES (?, ?, ?)",
            [newId, newOrdenCompraUrb.descripcion, newOrdenCompraUrb.fecha], (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                    return;
                }

                const detalleFormateado = []
                newOrdenCompraUrb.Detalle.forEach(detalle => {
                    detalleFormateado.push(
                        [newId, detalle.producto, detalle.cantidad, detalle.costo]
                    )
                })

                sql.query(`INSERT INTO detalle_orden_compra_lote (idorde_compra_lote,idProducto,cantidad_lote,costo_lote) VALUES ?`,
                    [detalleFormateado], (e) => {
                        if (e) {
                            console.log("error: ", e);
                            result(e, null);
                            return;
                        }

                        result(null, { ...newOrdenCompraUrb });
                    })
            });
    })
};

Orden_Compra_Urbanizacion.findById = (id, result) => {
    sql.query(`SELECT * FROM orde_compra_lote WHERE idorde_compra_lote = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found orde_compra_lote: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Orden_Compra_Urbanizacion with the id
        result({ kind: "not_found" }, null);
    });
};

Orden_Compra_Urbanizacion.getAll = (id, result) => {
    let query = "SELECT * FROM orde_compra_lote";

    let queryDetalle = `SELECT idorde_compra_lote,
    detalle_orden_compra_lote.idProducto,
	producto.Descripcion as nombreProducto,
    detalle_orden_compra_lote.cantidad_lote,
    detalle_orden_compra_lote.costo_lote
FROM detalle_orden_compra_lote
JOIN producto ON producto.idProducto = detalle_orden_compra_lote.idProducto
WHERE idorde_compra_lote = ?`;

    if (id) {
        query += ` WHERE idorde_compra_lote = ${id}`;
    }

    sql.query(query, async (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        const cabeceraConDetalle = []

        for await (cabecera of res) {
            const promesa = new Promise((resolver, rechazar) => {
                sql.query(queryDetalle,
                    [cabecera.idorde_compra_lote],
                    async (err2, res2) => {
                        if (err2) {
                            console.log("error: ", err);
                            return;
                        }
                        resolver(res2);
                    })
            })

            const detalle = await promesa

            cabeceraConDetalle.push({
                ...cabecera,
                detalle: detalle
            })
        }

        console.log("orde_compra_lote: ", cabeceraConDetalle);
        result(null, cabeceraConDetalle);
    });
};


Orden_Compra_Urbanizacion.updateById = (id, orde_compra_lote, result) => {
    sql.query(
        "UPDATE orde_compra_lote SET descripcion = ?, fecha = ?  WHERE idorde_compra_lote = ?",
        [orde_compra_lote.descripcion, orde_compra_lote.fecha, orde_compra_lote.idorde_compra_lote],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }


            if (res.affectedRows == 0) {
                // not found orde_compra_lote with the id
                result({ kind: "not_found" }, null);
                return;
            }
            //UPDATE DETALLE

            const detalleFormateado = []
            orde_compra_lote.Detalle.forEach(detalle => {
                detalleFormateado.push(
                    [orde_compra_lote.idorde_compra_lote, detalle.idProducto, detalle.cantidad_lote, detalle.costo_lote]
                )
            })


            sql.query(`DELETE FROM detalle_orden_compra_lote WHERE idorde_compra_lote = ?`,
                [orde_compra_lote.idorde_compra_lote], (e2) => {
                    if (e2) {
                        console.log("error: ", e2);
                        result(e, null);
                        return;
                    }
                    sql.query(`INSERT INTO detalle_orden_compra_lote (idorde_compra_lote,idProducto,cantidad_lote,costo_lote) VALUES ?`,
                        [detalleFormateado], (e) => {
                            if (e) {
                                console.log("error: ", e);
                                result(e, null);
                                return;
                            }

                            result(null, { ...orde_compra_lote });
                        })

                })

        }
    );
};

Orden_Compra_Urbanizacion.remove = (id, result) => {
    console.log("Removing orde_compra_lote with ID: ", id);

    // Eliminar detalles de orde_compra_lote primero
    sql.query("DELETE FROM detalle_orden_compra_lote WHERE idorde_compra_lote = ?", id, (err, res) => {
        if (err) {
            console.log("error deleting detalle_orden_compra_lote: ", err);
            result(null, err);
            return;
        }

        // Ahora eliminar la compra principal
        sql.query("DELETE FROM orde_compra_lote WHERE idorde_compra_lote = ?", id, (e, resp) => {
            if (e) {
                console.log("error deleting orde_compra_lote: ", e);
                result(null, e);
                return;
            }

            if (resp.affectedRows == 0) {
                // No se encontró la compra con el ID
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("Deleted orde_compra_lote with ID: ", id);

            result(null, resp);
        });
    });
};

module.exports = Orden_Compra_Urbanizacion;


