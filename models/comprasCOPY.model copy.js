const sql = require("../db.js");


// constructord
const Compras = function (compras) {
    this.idCompras = compras.idCompras;
    this.Fecha_doc = compras.Fecha_doc;
    this.Timbrado = compras.Timbrado;
    this.Numero_fact = compras.Numero_fact;
    this.idTipo_Documento = compras.idTipo_Documento;
    this.idProveedor = compras.idProveedor;
    this.idorden_compra = compras.idorden_compra;
    this.Detalle = compras.Detalle;
};

Compras.create = (newCompras, result) => {
    sql.query("SELECT idCompras as id FROM compras ORDER BY idCompras DESC LIMIT 1", null, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO compras (idCompras, idorden_compra, Fecha_doc, Timbrado, Numero_fact, idTipo_Documento, idProveedor) VALUES (?, ?, ?, ?, ?, ?, ?)", 
        [newId, newCompras.idorden_compra, newCompras.Fecha_doc, newCompras.Timbrado, newCompras.Numero_fact, newCompras.idTipo_Documento, newCompras.idProveedor], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            
            const detalleFormateado = []
            newCompras.Detalle.forEach(detalle => {
                detalleFormateado.push(
                  [newId, detalle.idProducto, detalle.Precio, detalle.Cantidad]  
                )
            })

            sql.query(`INSERT INTO detallecompras (idCompras, idProducto, Precio, Cantidad) VALUES ?`, 
            [detalleFormateado], (e) => {
                if (e) {
                    console.log("error: ", e);
                    result(e, null);
                    return;
                }
                

                result(null, { ...newCompras });
            })
        });
    })
};

Compras.findById = (id, result) => {
    sql.query(`SELECT * FROM compras WHERE idCompras = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found compras: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Compras with the id
        result({ kind: "not_found" }, null);
    });
};

Compras.getAll = (id, result) => {
    let query = `SELECT idCompras,
    Fecha_doc,
	Timbrado,
	Numero_fact,
	compras.idTipo_Documento,
    compras.idProveedor,
    compras.idorden_compra,
    proveedor.Razon_social as nombrecompras,
    tipo_documento.Descripcion as nombreproveedor
 FROM compras
 JOIN proveedor ON proveedor.idProveedor = compras.idProveedor
 JOIN tipo_documento ON tipo_documento.idTipo_Documento = compras.idTipo_Documento
 WHERE compras.estado_compras = false`;

    if (id) {
        query += ` AND idCompras = ${id}`; 
    }

    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        

        console.log("compras: ", res);
        result(null, res);
    });
};


// Compras.updateById = (id, compras, result) => {
//     sql.query(
//         "UPDATE compras SET Fecha_doc = ?, Timbrado = ?,  Numero_fact = ?, idTipo_Documento = ? , idProveedor = ? , idorden_compra = ? WHERE idCompras = ?",
//         [compras.Fecha_doc,  compras.Timbrado, compras.Numero_fact, compras.idTipo_Documento , compras.idProveedor , compras.idorden_compra , compras.idCompras],
//         (err, res) => {
//             if (err) {
//                 console.log("error: ", err);
//                 result(null, err);
//                 return;
//             }

//             if (res.affectedRows == 0) {
//                 // not found Compras with the id
//                 result({ kind: "not_found" }, null);
//                 return;
//             }

//             console.log("updated compras: ", { ...compras });
//             result(null, { ...compras });
//         }
//     );
// };

Compras.update = (id, result) => {
    console.log("Updating state of compras with ID: ", id);


    // Actualizar el estado de compras a true
    sql.query("UPDATE compras SET estado_compras = true WHERE idCompras = ?", [id], (e2, res) => 
    {
        if (e2) {
            console.log("error updating compras: ", e2);
            result(e2, null);
            return;
        }

        if (res.affectedRows == 0) {
            // No se encontró la compra con el ID
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("Updated state of compras with ID: ", id);
        result(null, res);

       
    });
};

module.exports = Compras;


