const sql = require("../db.js");


// constructord
const Compras = function (compras) {
    this.idCompras = compras.idCompras;
    this.Fecha_doc = compras.Fecha_doc;
    this.Fecha_operacion = compras.Fecha_operacion;
    this.Timbrado = compras.Timbrado;
    this.idTipo_Documento = compras.idTipo_Documento;
    this.idProveedor = compras.idProveedor;
    this.Numero_fact = compras.Numero_fact;
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

        sql.query("INSERT INTO compras (idCompras, Fecha_doc, Fecha_operacion, Timbrado, idTipo_Documento, idProveedor,Numero_fact) VALUES (?, ?, ?, ?, ?, ?, ?)", 
        [newId, newCompras.Fecha_doc, newCompras.Fecha_operacion, newCompras.Timbrado, newCompras.idTipo_Documento, newCompras.idProveedor, newCompras.Numero_fact], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            
            const detalleFormateado = []
            newCompras.Detalle.forEach(detalle => {
                detalleFormateado.push(
                  [newId, detalle.producto, detalle.precio, detalle.cantidad]  
                )
            })

            sql.query(`INSERT INTO detallecompras (Compras_idCompras,Producto_idProducto,Precio,Cantidad) VALUES ?`, 
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
    Fecha_operacion,
	Timbrado,
	compras.idTipo_Documento,
    compras.idProveedor,
    Numero_fact,
    proveedor.Razon_social as nombrecompras,
    tipo_documento.Descripcion as nombreproveedor
 FROM compras
 JOIN proveedor ON proveedor.idProveedor = compras.idProveedor
 JOIN tipo_documento ON tipo_documento.idTipo_Documento = compras.idTipo_Documento`;

    if (id) {
        query += ` WHERE idCompras = ${id}`;
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


Compras.updateById = (id, compras, result) => {
    sql.query(
        "UPDATE compras SET Fecha_doc = ?, Fecha_operacion = ?, Timbrado = ? , idTipo_Documento = ? , idProveedor = ? , Numero_fact = ?  WHERE idCompras = ?",
        [compras.Fecha_doc, compras.Fecha_operacion, compras.Timbrado, , compras.idTipo_Documento , compras.idProveedor , compras.Numero_fact, idCompras],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Compras with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated compras: ", { ...compras });
            result(null, { ...compras });
        }
    );
};

Compras.remove = (id, result) => {
    console.log("Removing compras with ID: ", id);

    // Eliminar detalles de compras primero
    sql.query("DELETE FROM detallecompras WHERE Compras_idCompras = ?", id, (err, res) => {
        if (err) {
            console.log("error deleting detallecompras: ", err);
            result(null, err);
            return;
        }

        // Ahora eliminar la compra principal
        sql.query("DELETE FROM compras WHERE idCompras = ?", id, (e, resp) => {
            if (e) {
                console.log("error deleting compras: ", e);
                result(null, e);
                return;
            }

            if (resp.affectedRows == 0) {
                // No se encontró la compra con el ID
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("Deleted compras with ID: ", id);

            result(null, resp);
        });
    });
};

module.exports = Compras;


