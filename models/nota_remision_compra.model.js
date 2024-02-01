const sql = require("../db.js");


// constructord
const Nota_Remision_Compra = function (nota_remision_compra) {
    this.idNota_Remision = nota_remision_compra.idNota_Remision;
    this.Fecha_doc = nota_remision_compra.Fecha_doc;
    this.Timbrado = nota_remision_compra.Timbrado;
    this.Numero_doc = nota_remision_compra.Numero_doc;
    this.idProveedor = nota_remision_compra.idProveedor;
    this.Detalle = nota_remision_compra.Detalle;
};

Nota_Remision_Compra.create = (newnota_remision_compra, result) => {
    sql.query("SELECT idNota_Remision as id FROM nota_remision ORDER BY idNota_Remision DESC LIMIT 1", null, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO nota_remision (idNota_Remision, Fecha_doc, Timbrado, Numero_doc, idProveedor) VALUES (?, ?, ?, ?, ?)",
            [newId, newnota_remision_compra.Fecha_doc, newnota_remision_compra.Timbrado, newnota_remision_compra.Numero_doc, newnota_remision_compra.idProveedor], (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                    return;
                }

                const detalleFormateado = []
                newnota_remision_compra.Detalle.forEach(detalle => {
                    detalleFormateado.push(
                        [newId, detalle.producto, detalle.cantidad, detalle.precio]
                    )
                })

                sql.query(`INSERT INTO detalle_nota_remision_compra (idNota_Remision,idProducto,Cantidad,Precio) VALUES ?`,
                    [detalleFormateado], (e) => {
                        if (e) {
                            console.log("error: ", e);
                            result(e, null);
                            return;
                        }

                        result(null, { ...newnota_remision_compra });
                    })
            });
    })
};

Nota_Remision_Compra.findById = (id, result) => {
    sql.query(`SELECT * FROM nota_remision WHERE idNota_Remision = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found nota_remision: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found nota_remision with the id
        result({ kind: "not_found" }, null);
    });
};

Nota_Remision_Compra.getAll = (id, result) => {
    let query = "SELECT * FROM nota_remision";

    let queryDetalle = `SELECT idNota_Remision,
    detalle_nota_remision_compra.idProducto,
	producto.Descripcion as nomnbreProducto,
    detalle_nota_remision_compra.Cantidad,
    detalle_nota_remision_compra.Precio
FROM detalle_nota_remision_compra
JOIN producto ON producto.idProducto = detalle_nota_remision_compra.idProducto
WHERE idNota_Remision = ?`;

    if (id) {
        query += ` WHERE idNota_Remision = ${id}`;
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
                    [cabecera.idNota_Remision],
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

        console.log("nota_remision: ", cabeceraConDetalle);
        result(null, cabeceraConDetalle);
    });
};


Nota_Remision_Compra.updateById = (id, nota_remision, result) => {
    sql.query(
        "UPDATE nota_remision SET Fecha_doc = ?, Timbrado = ? , Numero_doc = ? , idProveedor = ?  WHERE idNota_Remision = ?",
        [nota_remision.Fecha_doc, nota_remision.Timbrado, nota_remision.Numero_doc, nota_remision.idProveedor, nota_remision.idNota_Remision],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }


            if (res.affectedRows == 0) {
                // not found Nota_Remision_Compra with the id
                result({ kind: "not_found" }, null);
                return;
            }
            //UPDATE DETALLE

            const detalleFormateado = []
            nota_remision.Detalle.forEach(detalle => {
                detalleFormateado.push(
                    [nota_remision.idNota_Remision, detalle.idProducto, detalle.Cantidad, detalle.Precio]
                )
            })


            sql.query(`DELETE FROM detalle_nota_remision_compra WHERE idNota_Remision = ?`,
                [nota_remision.idNota_Remision], (e2) => {
                    if (e2) {
                        console.log("error: ", e2);
                        result(e, null);
                        return;
                    }
                    sql.query(`INSERT INTO detalle_nota_remision_compra (idNota_Remision,idProducto,Cantidad,Precio) VALUES ?`,
                        [detalleFormateado], (e) => {
                            if (e) {
                                console.log("error: ", e);
                                result(e, null);
                                return;
                            }

                            result(null, { ...nota_remision });
                        })

                })

        }
    );
};

Nota_Remision_Compra.remove = (id, result) => {
    console.log("Removing nota_remision with ID: ", id);

    // Eliminar detalles de nota_remision primero
    sql.query("DELETE FROM detalle_nota_remision_compra WHERE idNota_Remision = ?", id, (err, res) => {
        if (err) {
            console.log("error deleting detalle_nota_remision_compra: ", err);
            result(null, err);
            return;
        }

        // Ahora eliminar la compra principal
        sql.query("DELETE FROM nota_remision WHERE idNota_Remision = ?", id, (e, resp) => {
            if (e) {
                console.log("error deleting nota_remision: ", e);
                result(null, e);
                return;
            }

            if (resp.affectedRows == 0) {
                // No se encontró la compra con el ID
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("Deleted nota_remision with ID: ", id);

            result(null, resp);
        });
    });
};

module.exports = Nota_Remision_Compra;


