const sql = require("../db.js");


// constructord
const Nota_Debito_Venta = function (nota_debito_venta) {
    this.idNota_Debito_Venta = nota_debito_venta.idNota_Debito_Venta;
    this.Fecha_doc = nota_debito_venta.Fecha_doc;
    this.idCliente = nota_debito_venta.idCliente;
    this.Numero_doc = nota_debito_venta.Numero_doc;
    this.idTimbrado = nota_debito_venta.idTimbrado;
    this.idVenta = nota_debito_venta.idVenta;
    this.idTipo_Documento = nota_debito_venta.idTipo_Documento;
    this.idCaja = nota_debito_venta.idCaja;
    this.fecha_vto = nota_debito_venta.fecha_vto;
    this.Detalle = nota_debito_venta.Detalle;
};

Nota_Debito_Venta.create = (newNCV, result) => {
    sql.query("SELECT idNota_Debito_Venta as id FROM nota_debito_venta ORDER BY idNota_Debito_Venta DESC LIMIT 1", null, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO nota_debito_venta (idNota_Debito_Venta, Fecha_doc, idCliente, Numero_doc, idTimbrado, idVenta, idTipo_Documento, idCaja, fecha_vto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", 
        [newId, newNCV.Fecha_doc, newNCV.idCliente, newNCV.Numero_doc, newNCV.idTimbrado, newNCV.idVenta, newNCV.idTipo_Documento, newNCV.idCaja || 100, newNCV.fecha_vto || '2021-01-15'], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            
            const detalleFormateado = []
            newNCV.Detalle.forEach(detalle => {
                detalleFormateado.push(
                  [newId, detalle.idContrato, detalle.Precio, detalle.Cantidad]  
                )
            })

            sql.query(`INSERT INTO detalle_nota_debito_venta (idNota_Debito_Venta, idContrato, Precio, Cantidad) VALUES ?`, 
            [detalleFormateado], (e) => {
                if (e) {
                    console.log("error: ", e);
                    result(e, null);
                    return;
                }
                

                result(null, { ...newNCV });
            })
        });
    })
};

Nota_Debito_Venta.findById = (id, result) => {

   const queryCabecera = `SELECT * FROM nota_debito_venta WHERE idNota_Debito_Venta = ${id}`;

    const queryDetalle = `SELECT idNota_Debito_Venta,
    detalle_nota_debito_venta.idProducto,
    producto.Descripcion as nombreProducto,
    producto.IdIva,
    detalle_nota_debito_venta.Precio,
    detalle_nota_debito_venta.Cantidad
FROM detalle_nota_debito_venta
JOIN producto ON producto.idProducto = detalle_nota_debito_venta.idProducto
WHERE idNota_Debito_Venta`;

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

                console.log("found nota_debito_venta: ", notac);
                result(null, notac);
            });
        } else {
            // No se encontró la compras con el id proporcionado
            result({ kind: "not_found" }, null);
        }
    });
};
Nota_Debito_Venta.getAll = (id, result) => {
    let query = `SELECT idNota_Debito_Venta,
    nota_debito_venta.Fecha_doc,
    nota_debito_venta.idCliente,
    cliente.Razon_social as nombreCliente,
    nota_debito_venta.Numero_doc,
    nota_debito_venta.idTimbrado,
    timbrado.NumerTimbrado as numeroTimbrado,
    nota_debito_venta.idVenta,
    nota_debito_venta.idTipo_Documento,
    tipo_documento.Descripcion as nombreTipoVenta,
    nota_debito_venta.idCaja,
    nota_debito_venta.Estado_nd_venta,
    nota_debito_venta.fecha_vto
FROM nota_debito_venta
JOIN tipo_documento ON tipo_documento.idTipo_Documento = nota_debito_venta.idTipo_Documento
JOIN cliente ON cliente.idCliente = nota_debito_venta.idCliente
JOIN timbrado ON timbrado.idTimbrado = nota_debito_venta.idTimbrado
WHERE nota_debito_venta.Estado_nd_venta = false`;

    let queryDetalle = 
    `SELECT idNota_Debito_Venta,
    detalle_nota_debito_venta.idContrato,
    detalle_nota_debito_venta.Precio,
    detalle_nota_debito_venta.Cantidad
FROM detalle_nota_debito_venta
WHERE idNota_Debito_Venta = ?`;

    if (id) {
        query += ` WHERE idNota_Debito_Venta = ${id}`;
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
                    [cabecera.idNota_Debito_Venta],
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

        console.log("nota_debito_venta: ", cabeceraConDetalle);
        result(null, cabeceraConDetalle);
    });
};


Nota_Debito_Venta.update = (id, result) => {
    console.log("Updating state of nota_debito_venta with ID: ", id);


    // Actualizar el estado de nota_debito_venta a true
    sql.query("UPDATE nota_debito_venta SET Estado_nd_venta = true WHERE idNota_Debito_Venta = ?", [id], (e2, res) => 
    {
        if (e2) {
            console.log("error updating nota_debito_venta: ", e2);
            result(e2, null);
            return;
        }

        if (res.affectedRows == 0) {
            // No se encontró la compra con el ID
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("Updated state of nota_debito_venta with ID: ", id);
        result(null, res);

       
    });
};

module.exports = Nota_Debito_Venta;


