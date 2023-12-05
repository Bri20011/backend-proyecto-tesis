const sql = require("../db.js");


// constructord
const Nota_Credito_Compra = function (nota_credito_compra) {
    this.idNota_CreditoCompra = nota_credito_compra.idNota_CreditoCompra;
    this.Numero_doc = nota_credito_compra.Numero_doc;
    this.Fecha = nota_credito_compra.Fecha;
    this.idProveedor = nota_credito_compra.idProveedor;
    this.Detalle = nota_credito_compra.Detalle;
};

Nota_Credito_Compra.create = (newnota_credito_compra, result) => {
    sql.query("SELECT idNota_CreditoCompra as id FROM nota_credito_compra ORDER BY idNota_CreditoCompra DESC LIMIT 1", null, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO nota_credito_compra (idNota_CreditoCompra, Numero_doc, Fecha, idProveedor, idCompras) VALUES (?, ?, ?, ?, ?)",
            [newId, newnota_credito_compra.Numero_doc, newnota_credito_compra.Fecha, newnota_credito_compra.idProveedor, newnota_credito_compra.idCompras], (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                    return;
                }

                const detalleFormateado = []
                newnota_credito_compra.Detalle.forEach(detalle => {
                    detalleFormateado.push(
                        [newId, detalle.idProducto, detalle.Cantidad, detalle.Precio]
                    )
                })

                sql.query(`INSERT INTO detalle_nota_credito (idNota_CreditoCompra, idProducto, Cantidad,Precio) VALUES ?`,
                    [detalleFormateado], (e) => {
                        if (e) {
                            console.log("error: ", e);
                            result(e, null);
                            return;
                        }

                        sql.query('UPDATE presupuesto SET Estado = true WHERE idPresupuesto = ?',
                            [newnota_credito_compra.idNota_CreditoCompra], (e2) => {
                                if (e2) {
                                    console.log("error: ", e2);
                                    result(e2, null);
                                    return;
                                }
                                result(null, { ...newnota_credito_compra });
                            })
                    })
            });
    })
};

Nota_Credito_Compra.findById = (id, result) => {
    const queryCabecera = `SELECT * FROM nota_credito_compra WHERE idNota_CreditoCompra = ${id}`;

    const queryDetalle = `SELECT idNota_CreditoCompra,
    detalle_nota_credito.idProducto,
    producto.Descripcion as nombreProducto,
    producto.idIva,
    detalle_nota_credito.Cantidad,
    detalle_nota_credito.Precio
FROM detalle_nota_credito
JOIN producto ON producto.idProducto = detalle_nota_credito.idProducto
WHERE idNota_CreditoCompra = ?`

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
                const notacredito = {
                    ...resCabecera[0],
                    detalle: resDetalle,
                };

                console.log("found nota_credito_compra: ", notacredito);
                result(null, notacredito);
            });
        } else {
            // No se encontró la nota_credito_compra con el id proporcionado
            result({ kind: "not_found" }, null);
        }
    });
};

Nota_Credito_Compra.getAll = (id, result) => {
    let query = "SELECT * FROM nota_credito_compra";

    let queryDetalle = 
    `SELECT idNota_CreditoCompra,
    detalle_nota_credito.idProducto,
    producto.Descripcion as nombreProducto,
    producto.idIva,
    detalle_nota_credito.Cantidad,
    detalle_nota_credito.Precio
FROM detalle_nota_credito
JOIN producto ON producto.idProducto = detalle_nota_credito.idProducto
WHERE idNota_CreditoCompra =  ?`;

    if (id) {
        query += ` WHERE idNota_CreditoCompra = ${id}`;
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
                    [cabecera.idNota_CreditoCompra],
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

        console.log("nota_credito_compra: ", cabeceraConDetalle);
        result(null, cabeceraConDetalle);
    });
};


// Nota_Credito_Compra.updateById = (id, nota_credito_compra, result) => {
//     sql.query(
//         "UPDATE orden_compra SET Descripcion = ?, Fecha_pedi = ?, idPedido = ?   WHERE idorden_compra = ?",
//         [orden_compra.Descripcion, orden_compra.Fecha_pedi, orden_compra.idProveedor, idorden_compra],
//         (err, res) => {
//             if (err) {
//                 console.log("error: ", err);
//                 result(null, err);
//                 return;
//             }

//             if (res.affectedRows == 0) {
//                 // not found Orden_Compra with the id
//                 result({ kind: "not_found" }, null);
//                 return;
//             }

//             console.log("updated orden_compra: ", { ...orden_compra });
//             result(null, { ...orden_compra });
//         }
//     );
// };

Nota_Credito_Compra.remove = (id, result) => {
    console.log("Removing nota_credito_compra with ID: ", id);

    // Eliminar detalles de Nota de Credito primero
    sql.query("DELETE FROM detalle_nota_credito WHERE idNota_CreditoCompra = ?", id, (err, res) => {
        if (err) {
            console.log("error deleting detalle_nota_credito: ", err);
            result(null, err);
            return;
        }

        // Ahora eliminar la Nota de Credito Cabecera principal
        sql.query("DELETE FROM nota_credito_compra WHERE idNota_CreditoCompra = ?", id, (e, resp) => {
            if (e) {
                console.log("error deleting nota_credito_compra: ", e);
                result(null, e);
                return;
            }

            if (resp.affectedRows == 0) {
                // No se encontró la nota_credito_compra con el ID
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("Deleted nota_credito_compra with ID: ", id);

            result(null, resp);
        });
    });
};

module.exports = Nota_Credito_Compra;


