const sql = require("../db.js");


// constructord
const Orden_Compra_Urb = function (orden_compra_urb) {
    this.idOrden_Compra_Urb = orden_compra_urb.idOrden_Compra_Urb;
    this.Descripcion = orden_compra_urb.Descripcion;
    this.Fecha_pedi = orden_compra_urb.Fecha_pedi;
    this.PrecioT = orden_compra_urb.PrecioT;
    this.idProveedor = orden_compra_urb.idProveedor;
    this.Detalle = orden_compra_urb.Detalle;
};

Orden_Compra_Urb.create = (neworden_compra_urb, result) => {
    sql.query("SELECT idOrden_Compra_Urb as id FROM orden_compra_urb ORDER BY idOrden_Compra_Urb DESC LIMIT 1", null, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO orden_compra_urb (idOrden_Compra_Urb, idPedido_Urbanizacion, Descripcion, Fecha_pedi, PrecioT, idProveedor) VALUES (?, ?, ?, ?, ?, ?)",
            [newId, neworden_compra_urb.idOrden_Compra_Urb, neworden_compra_urb.Descripcion, neworden_compra_urb.Fecha_pedi, neworden_compra_urb.PrecioT, neworden_compra_urb.idProveedor], (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                    return;
                }

                const detalleFormateado = []
                neworden_compra_urb.Detalle.forEach(detalle => {
                    detalleFormateado.push(
                        [newId, detalle.idProducto, detalle.Cantidad, detalle.Precio]
                    )
                })

                sql.query(`INSERT INTO detalle_ordencompraurb (idOrden_Compra_Urb, idProducto, Cantidad, Precio) VALUES ?`,
                    [detalleFormateado], (e) => {
                        if (e) {
                            console.log("error: ", e);
                            result(e, null);
                            return;
                        }

                        sql.query('UPDATE pedido_urbanizacion SET Aprobar_pedido = true WHERE idPedido_Urbanizacion = ?',
                            [neworden_compra_urb.idOrden_Compra_Urb], (e2) => {
                                if (e2) {
                                    console.log("error: ", e2);
                                    result(e2, null);
                                    return;
                                }
                                result(null, { ...neworden_compra_urb });
                            })
                    })
            });
    })
};

Orden_Compra_Urb.findById = (id, result) => {
    const queryCabecera = `SELECT * FROM orden_compra_urb WHERE idOrden_Compra_Urb = ${id}`;

    const queryDetalle = `SELECT idOrden_Compra_Urb,
    detalle_ordencompraurb.idProducto,
    producto.Descripcion as nombreProducto,
    detalle_ordencompraurb.Cantidad,
    detalle_ordencompraurb.Precio
FROM detalle_ordencompraurb
JOIN producto ON producto.idProducto = detalle_ordencompraurb.idProducto
WHERE idOrden_Compra_Urb = ?`;

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
                const ordenCompraUrb = {
                    ...resCabecera[0],
                    detalle: resDetalle,
                };

                console.log("found orden_compra_urb: ", ordenCompraUrb);
                result(null, ordenCompraUrb);
            });
        } else {
            // No se encontró la orden_compra_urb con el id proporcionado
            result({ kind: "not_found" }, null);
        }
    });
};

Orden_Compra_Urb.getAll = (id, result) => {
    let query = "SELECT * FROM orden_compra_urb";

    let queryDetalle = 
    `SELECT idOrden_Compra_Urb,
    detalle_ordencompraurb.idProducto,
    producto.Descripcion as nombreProducto,
    detalle_ordencompraurb.Cantidad,
    detalle_ordencompraurb.Precio
FROM detalle_ordencompraurb
JOIN producto ON producto.idProducto = detalle_ordencompraurb.idProducto
WHERE idOrden_Compra_Urb = ?`;

    if (id) {
        query += ` WHERE idOrden_Compra_Urb = ${id}`;
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
                    [cabecera.idOrden_Compra_Urb],
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

        console.log("orden_compra_urb: ", cabeceraConDetalle);
        result(null, cabeceraConDetalle);
    });
};


Orden_Compra_Urb.updateById = (id, orden_compra_urb, result) => {
    sql.query(
        "UPDATE orden_compra SET Descripcion = ?, Fecha_pedi = ?, idPedido = ?   WHERE idOrden_Compra_Urb = ?",
        [orden_compra_urb.Descripcion, orden_compra_urb.Fecha_pedi, orden_compra_urb.idProveedor, orden_compra_urb.idorden_compra],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Orden_Compra_Urb with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated orden_compra_urb: ", { ...orden_compra_urb });
            result(null, { ...orden_compra_urb });
        }
    );
};

Orden_Compra_Urb.remove = (id, result) => {
    console.log("Removing orden_compra_urb with ID: ", id);

    // Eliminar detalles de orden_compra_urb primero
    sql.query("DELETE FROM detalle_ordencompraurb WHERE idOrden_Compra_Urb = ?", id, (err, res) => {
        if (err) {
            console.log("error deleting detalle_ordencompraurb: ", err);
            result(null, err);
            return;
        }

        // Ahora eliminar la Orden_Compra_Urb Cabecera principal
        sql.query("DELETE FROM orden_compra_urb WHERE idOrden_Compra_Urb = ?", id, (e, resp) => {
            if (e) {
                console.log("error deleting orden_compra_urb: ", e);
                result(null, e);
                return;
            }

            if (resp.affectedRows == 0) {
                // No se encontró la orden_compra_urb con el ID
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("Deleted orden_compra_urb with ID: ", id);

            result(null, resp);
        });
    });
};

module.exports = Orden_Compra_Urb;


