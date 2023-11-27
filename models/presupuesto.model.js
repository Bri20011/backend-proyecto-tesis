const sql = require("../db.js");


// constructord
const Presupuesto = function (presupuesto) {
    this.idPresupuesto = presupuesto.idPresupuesto;
    this.Descripcion = presupuesto.Descripcion;
    this.Fecha_pedi = presupuesto.Fecha_pedi;
    this.idProveedor = presupuesto.idProveedor;
    this.Detalle = presupuesto.Detalle;
};

Presupuesto.create = (newPresupuesto, result) => {
    sql.query("SELECT idPresupuesto as id FROM presupuesto ORDER BY idPresupuesto DESC LIMIT 1", null, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO presupuesto (idPresupuesto, idPedido, Descripcion, Fecha_pedi, idProveedor) VALUES (?, ?, ?, ?, ?)", 
        [newId, newPresupuesto.idPresupuesto, newPresupuesto.Descripcion, newPresupuesto.Fecha_pedi, newPresupuesto.idProveedor], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            
            const detalleFormateado = []
            newPresupuesto.Detalle.forEach(detalle => {
                detalleFormateado.push(
                  [newId, detalle.idProducto, detalle.Cantidad, detalle.Precio]  
                )
            })

            sql.query(`INSERT INTO detalle_presupuesto (idPresupuesto,idProducto,Cantidad,Precio) VALUES ?`, 
            [detalleFormateado], (e) => {
                if (e) {
                    console.log("error: ", e);
                    result(e, null);
                    return;
                }

             
                   result(null, { ...newPresupuesto });
                 })  
            });
        })
   
};

Presupuesto.findById = (id, result) => {
    sql.query(`SELECT * FROM presupuesto WHERE idPresupuesto = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found presupuesto: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Presupuesto with the id
        result({ kind: "not_found" }, null);
    });
};

Presupuesto.getAll = (id, result) => {
    let query = "SELECT * FROM presupuesto WHERE estado = false";

    let queryDetalle = `SELECT idPresupuesto,
    detalle_presupuesto.idProducto,
	producto.Descripcion as nomnbreProducto,
    detalle_presupuesto.Cantidad,
    detalle_presupuesto.Precio
FROM detalle_presupuesto
JOIN producto ON producto.idProducto = detalle_presupuesto.idProducto
WHERE idPresupuesto = ?`;

    if (id) {
        query += ` WHERE idPresupuesto = ${id}`;
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
                    [cabecera.idPresupuesto],
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

        console.log("presupuesto: ", cabeceraConDetalle);
        result(null, cabeceraConDetalle);
    });
};


Presupuesto.updateById = (id, presupuesto, result) => {
    sql.query(
        "UPDATE presupuesto SET Descripcion = ?, Fecha_pedi = ?  WHERE idPresupuesto = ?",
        [presupuesto.Descripcion, presupuesto.Fecha_pedi, idPresupuesto],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Presupuesto with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated presupuesto: ", { ...presupuesto });
            result(null, { ...presupuesto });
        }
    );
};

Presupuesto.remove = (id, result) => {
    console.log("Removing presupuesto with ID: ", id);

    // Eliminar detalles de presupuesto primero
    sql.query("DELETE FROM detalle_presupuesto WHERE idPresupuesto = ?", id, (err, res) => {
        if (err) {
            console.log("error deleting detalle_presupuesto: ", err);
            result(null, err);
            return;
        }

        // Ahora eliminar la Orden Cabecera principal
        sql.query("DELETE FROM presupuesto WHERE idPresupuesto = ?", id, (e, resp) => {
            if (e) {
                console.log("error deleting presupuesto: ", e);
                result(null, e);
                return;
            }

            if (resp.affectedRows == 0) {
                // No se encontró la presupuesto con el ID
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("Deleted presupuesto with ID: ", id);

            result(null, resp);
        });
    });
};

module.exports = Presupuesto;


