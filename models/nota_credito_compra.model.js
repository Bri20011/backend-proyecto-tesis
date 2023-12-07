const sql = require("../db.js");


// constructord
const Nota_Credito_Compra = function (nota_credito_compra) {
    this.idNota_CreditoCompra = nota_credito_compra.idNota_CreditoCompra;
    this.Fecha_doc = nota_credito_compra.Fecha_doc;
    this.Timbrado = nota_credito_compra.Timbrado;
    this.Numero_doc = nota_credito_compra.Numero_doc;
    this.idProveedor = nota_credito_compra.idProveedor;
    this.idCompras = nota_credito_compra.idCompras;
    this.Detalle = nota_credito_compra.Detalle;
};

Nota_Credito_Compra.create = (newNCC, result) => {
    sql.query("SELECT idNota_CreditoCompra as id FROM nota_credito_compra ORDER BY idNota_CreditoCompra DESC LIMIT 1", null, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO nota_credito_compra (idNota_CreditoCompra, idCompras, Fecha_doc, Timbrado, Numero_doc, idProveedor) VALUES (?, ?, ?, ?, ?, ?)", 
        [newId, newNCC.idCompras, newNCC.Fecha_doc, newNCC.Timbrado, newNCC.Numero_doc, newNCC.idProveedor], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            
            const detalleFormateado = []
            newNCC.Detalle.forEach(detalle => {
                detalleFormateado.push(
                  [newId, detalle.idProducto, detalle.Precio, detalle.Cantidad]  
                )
            })

            sql.query(`INSERT INTO detalle_nota_credito (idNota_CreditoCompra, idProducto, Precio, Cantidad) VALUES ?`, 
            [detalleFormateado], (e) => {
                if (e) {
                    console.log("error: ", e);
                    result(e, null);
                    return;
                }
                

                result(null, { ...newNCC });
            })
        });
    })
};

Nota_Credito_Compra.findById = (id, result) => {

   const queryCabecera = `SELECT * FROM nota_credito_compra WHERE idNota_CreditoCompra = ${id}`;

    const queryDetalle = `SELECT idNota_CreditoCompra,
    detalle_nota_credito.idProducto,
    producto.Descripcion as nombreProducto,
    producto.IdIva,
    detalle_nota_credito.Precio,
    detalle_nota_credito.Cantidad
FROM detalle_nota_credito
JOIN producto ON producto.idProducto = detalle_nota_credito.idProducto
WHERE idNota_CreditoCompra`;

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

                console.log("found nota_credito_compra: ", notac);
                result(null, notac);
            });
        } else {
            // No se encontró la compras con el id proporcionado
            result({ kind: "not_found" }, null);
        }
    });
};
Nota_Credito_Compra.getAll = (id, result) => {
    let query = "SELECT * FROM nota_credito_compra WHERE nota_credito_compra.estado_nc = false";

    let queryDetalle = 
    `SELECT idNota_CreditoCompra,
    detalle_nota_credito.idProducto,
    producto.Descripcion as nombreProducto,
    detalle_nota_credito.Precio,
    detalle_nota_credito.Cantidad
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


Nota_Credito_Compra.update = (id, result) => {
    console.log("Updating state of nota_credito_compra with ID: ", id);


    // Actualizar el estado de nota_credito_compra a true
    sql.query("UPDATE nota_credito_compra SET estado_nc = true WHERE idNota_CreditoCompra = ?", [id], (e2, res) => 
    {
        if (e2) {
            console.log("error updating nota_credito_compra: ", e2);
            result(e2, null);
            return;
        }

        if (res.affectedRows == 0) {
            // No se encontró la compra con el ID
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("Updated state of nota_credito_compra with ID: ", id);
        result(null, res);

       
    });
};

module.exports = Nota_Credito_Compra;


