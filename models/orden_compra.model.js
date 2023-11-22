const sql = require("../db.js");


// constructord
const Orden_Compra = function (orden_compra) {
    this.idorden_compra = orden_compra.idorden_compra;
    this.Descripcion = orden_compra.Descripcion;
    this.Fecha_pedi = orden_compra.Fecha_pedi;
    this.Precio = orden_compra.Precio;
    this.idProveedor = orden_compra.idProveedor;
    this.Detalle = orden_compra.Detalle;
};

Orden_Compra.create = (neworden_compra, result) => {
    sql.query("SELECT idorden_compra as id FROM orden_compra ORDER BY idorden_compra DESC LIMIT 1", null, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO orden_compra (idorden_compra, idPresupuesto, Descripcion, Fecha_pedi, Precio, idProveedor) VALUES (?, ?, ?, ?, ?, ?)",
            [newId, neworden_compra.idorden_compra, neworden_compra.Descripcion, neworden_compra.Fecha_pedi, neworden_compra.Precio, neworden_compra.idProveedor], (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                    return;
                }

                const detalleFormateado = []
                neworden_compra.Detalle.forEach(detalle => {
                    detalleFormateado.push(
                        [newId, detalle.idProducto, detalle.Cantida]
                    )
                })

                sql.query(`INSERT INTO detalle_orden_compra (idorden_compra,idProducto,Cantida) VALUES ?`,
                    [detalleFormateado], (e) => {
                        if (e) {
                            console.log("error: ", e);
                            result(e, null);
                            return;
                        }

                        sql.query('UPDATE presupuesto SET Estado = true WHERE idPresupuesto = ?',
                            [neworden_compra.idorden_compra], (e2) => {
                                if (e2) {
                                    console.log("error: ", e2);
                                    result(e2, null);
                                    return;
                                }
                                result(null, { ...neworden_compra });
                            })
                    })
            });
    })
};

Orden_Compra.findById = (id, result) => {
    const queryCabecera = `SELECT * FROM orden_compra WHERE idorden_compra = ${id}`;
    const queryDetalle = `
        SELECT idorden_compra,
        detalle_orden_compra.idProducto,
        producto.Descripcion as nombreProducto,
        detalle_orden_compra.Cantida
        FROM detalle_orden_compra
        JOIN producto ON producto.idProducto = detalle_orden_compra.idProducto
        WHERE idorden_compra = ?`;

    // Realiza ambas consultas en paralelo
    sql.query(queryCabecera, (errCabecera, resCabecera) => {
        if (errCabecera) {
            console.log("error: ", errCabecera);
            result(errCabecera, null);
            return;
        }

        // Si la cabecera se encuentra, realiza la consulta del detalle
        if (resCabecera.length) {
            sql.query(queryDetalle, [id], (errDetalle, resDetalle) => {
                if (errDetalle) {
                    console.log("error: ", errDetalle);
                    result(errDetalle, null);
                    return;
                }

                // Combina la cabecera y el detalle en un solo objeto
                const ordenCompra = {
                    ...resCabecera[0],
                    detalle: resDetalle,
                };

                console.log("found orden_compra: ", ordenCompra);
                result(null, ordenCompra);
            });
        } else {
            // No se encontró la orden_compra con el id proporcionado
            result({ kind: "not_found" }, null);
        }
    });
};

Orden_Compra.getAll = (id, result) => {
    let query = "SELECT * FROM orden_compra";

    let queryDetalle = 
    `SELECT idorden_compra,
    detalle_orden_compra.idProducto,
	producto.Descripcion as nomnbreProducto,
    detalle_orden_compra.Cantida
FROM detalle_orden_compra
JOIN producto ON producto.idProducto = detalle_orden_compra.idProducto
WHERE idorden_compra = ?`;

    if (id) {
        query += ` WHERE idorden_compra = ${id}`;
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
                    [cabecera.idorden_compra],
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

        console.log("orden_compra: ", cabeceraConDetalle);
        result(null, cabeceraConDetalle);
    });
};


Orden_Compra.updateById = (id, orden_compra, result) => {
    sql.query(
        "UPDATE orden_compra SET Descripcion = ?, Fecha_pedi = ?, Precio = ? , idPedido = ?   WHERE idorden_compra = ?",
        [orden_compra.Descripcion, orden_compra.Fecha_pedi, orden_compra.Precio,orden_compra.idProveedor, idorden_compra],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Orden_Compra with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated orden_compra: ", { ...orden_compra });
            result(null, { ...orden_compra });
        }
    );
};

Orden_Compra.remove = (id, result) => {
    console.log("Removing orden_compra with ID: ", id);

    // Eliminar detalles de orden_compra primero
    sql.query("DELETE FROM detalle_orden_compra WHERE idorden_compra = ?", id, (err, res) => {
        if (err) {
            console.log("error deleting detalle_orden_compra: ", err);
            result(null, err);
            return;
        }

        // Ahora eliminar la OrdenCompra Cabecera principal
        sql.query("DELETE FROM orden_compra WHERE idorden_compra = ?", id, (e, resp) => {
            if (e) {
                console.log("error deleting orden_compra: ", e);
                result(null, e);
                return;
            }

            if (resp.affectedRows == 0) {
                // No se encontró la orden_compra con el ID
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("Deleted orden_compra with ID: ", id);

            result(null, resp);
        });
    });
};

module.exports = Orden_Compra;


