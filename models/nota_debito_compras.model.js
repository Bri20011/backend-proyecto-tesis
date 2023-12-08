const sql = require("../db.js");


// constructord
const Nota_Debito_Compra = function (nota_debito_compras) {
    this.idNota_Debito_Compra = nota_debito_compras.idNota_Debito_Compra;
    this.Fecha_doc = nota_debito_compras.Fecha_doc;
    this.Timbrado = nota_debito_compras.Timbrado;
    this.Numero_doc = nota_debito_compras.Numero_doc;
    this.idProveedor = nota_debito_compras.idProveedor;
    this.idCompras = nota_debito_compras.idCompras;
    this.Detalle = nota_debito_compras.Detalle;
};

Nota_Debito_Compra.create = (newNDC, result) => {
    sql.query("SELECT idNota_Debito_Compra as id FROM nota_debito_compra ORDER BY idNota_Debito_Compra DESC LIMIT 1", null, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO nota_debito_compra (idNota_Debito_Compra, idCompras, Fecha_doc, Timbrado, Numero_doc, idProveedor) VALUES (?, ?, ?, ?, ?, ?)", 
        [newId, newNDC.idCompras, newNDC.Fecha_doc, newNDC.Timbrado, newNDC.Numero_doc, newNDC.idProveedor], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            
            const detalleFormateado = []
            newNDC.Detalle.forEach(detalle => {
                detalleFormateado.push(
                  [newId, detalle.idProducto, detalle.Precio, detalle.Cantidad]  
                )
            })

            sql.query(`INSERT INTO detalle_nota_debito (idNota_Debito_Compra, idProducto, Precio, Cantidad) VALUES ?`, 
            [detalleFormateado], (e) => {
                if (e) {
                    console.log("error: ", e);
                    result(e, null);
                    return;
                }
                

                result(null, { ...newNDC });
            })
        });
    })
};

Nota_Debito_Compra.findById = (id, result) => {

   const queryCabecera = `SELECT * FROM nota_debito_compra WHERE idNota_Debito_Compra = ${id}`;

    const queryDetalle = `SELECT idNota_Debito_Compra,
    detalle_nota_debito.idProducto,
    producto.Descripcion as nombreProducto,
    detalle_nota_debito.Precio,
    detalle_nota_debito.Cantidad
FROM detalle_nota_debito
JOIN producto ON producto.idProducto = detalle_nota_debito.idProducto
WHERE idNota_Debito_Compra`;

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
                const notac = {
                    ...resCabecera[0],
                    detalle: resDetalle,
                };

                console.log("found nota_debito_compra: ", notac);
                result(null, notac);
            });
        } else {
            // No se encontró la compras con el id proporcionado
            result({ kind: "not_found" }, null);
        }
    });
};
Nota_Debito_Compra.getAll = (id, result) => {
    let query = "SELECT * FROM nota_debito_compra WHERE nota_debito_compra.estado_nd = false";

    let queryDetalle = 
    `SELECT idNota_Debito_Compra,
    detalle_nota_debito.idProducto,
    producto.Descripcion as nombreProducto,
    detalle_nota_debito.Precio,
    detalle_nota_debito.Cantidad
FROM detalle_nota_debito
JOIN producto ON producto.idProducto = detalle_nota_debito.idProducto
WHERE idNota_Debito_Compra = ?`;

    if (id) {
        query += ` WHERE idNota_Debito_Compra = ${id}`;
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
                    [cabecera.idNota_Debito_Compra],
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

        console.log("nota_debito_compra: ", cabeceraConDetalle);
        result(null, cabeceraConDetalle);
    });
};


Nota_Debito_Compra.update = (id, result) => {
    console.log("Updating state of nota_debito_compra with ID: ", id);


    // Actualizar el estado de nota_debito_compra a true
    sql.query("UPDATE nota_debito_compra SET estado_nd = true WHERE idNota_Debito_Compra = ?", [id], (e2, res) => 
    {
        if (e2) {
            console.log("error updating nota_debito_compra: ", e2);
            result(e2, null);
            return;
        }

        if (res.affectedRows == 0) {
            // No se encontró la compra con el ID
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("Updated state of nota_debito_compra with ID: ", id);
        result(null, res);

       
    });
};

module.exports = Nota_Debito_Compra;


