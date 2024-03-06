const sql = require("../db.js");


// constructord
const Urbanizacion = function (urbanizacion) {
    this.idUrbanizacion = urbanizacion.idUrbanizacion;
    this.Nombre_Urbanizacion = urbanizacion.Nombre_Urbanizacion;
    this.fecha_urb = urbanizacion.fecha_urb;
    this.Ubicacion = urbanizacion.Ubicacion;
    this.idBarrio = urbanizacion.idBarrio;
    this.idCiudad = urbanizacion.idCiudad;
    this.Costo_total = urbanizacion.Costo_total;
    this.idStock_Lote = urbanizacion.idStock_Lote;
    this.Detalle = urbanizacion.Detalle;
};

Urbanizacion.create = (newUrbanizacion, result) => {
    sql.query("SELECT idUrbanizacion as id FROM urbanizacion ORDER BY idUrbanizacion DESC LIMIT 1", null, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO urbanizacion (idUrbanizacion, Nombre_Urbanizacion, fecha_urb, Ubicacion, idCiudad, idBarrio, Costo_total, idStock_Lote) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [newId, newUrbanizacion.Nombre_Urbanizacion, newUrbanizacion.fecha_urb, newUrbanizacion.Ubicacion, newUrbanizacion.idCiudad, newUrbanizacion.idBarrio, newUrbanizacion.Costo_total, newUrbanizacion.idStock_Lote], (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                    return;
                }

                const detalleFormateado = []
                newUrbanizacion.Detalle.forEach(detalle_urbanizacion => {
                    detalleFormateado.push(
                        [newId, detalle_urbanizacion.idProducto, detalle_urbanizacion.id_detalle, detalle_urbanizacion.idManzana, detalle_urbanizacion.Numero_lote, detalle_urbanizacion.ancho_frente, detalle_urbanizacion.ancho_atras, detalle_urbanizacion.long_izquierdo, detalle_urbanizacion.long_derecho, detalle_urbanizacion.costo_urbanizacion]
                    )
                })

                sql.query(`INSERT INTO detalle_urbanizacion (idUrbanizacion, idProducto, id_detalle, idManzana, Numero_lote, ancho_frente, ancho_atras, long_izquierdo, long_derecho, costo_urbanizacion) VALUES ?`,
                    [detalleFormateado], (e) => {
                        if (e) {
                            console.log("error: ", e);
                            result(e, null);
                            return;
                        }


                        result(null, { ...newUrbanizacion });
                    })
            });
    })
};

Urbanizacion.findById = (numeroFactura, result) => {
    const queryCabecera = `SELECT * FROM urbanizacion WHERE idUrbanizacion = ?`;

    const queryDetalle = `SELECT idUrbanizacion,
    detalle_urbanizacion.idProducto,
    producto.Descripcion as nomnbreProducto,
    detalle_urbanizacion.id_detalle,
    detalle_urbanizacion.idManzana,
    manzana.Descripcion as nombreManzana,
    detalle_urbanizacion.Numero_lote,
    detalle_urbanizacion.ancho_frente,
    detalle_urbanizacion.ancho_atras,
    detalle_urbanizacion.long_izquierdo,
    detalle_urbanizacion.long_derecho,
    detalle_urbanizacion.costo_urbanizacion
FROM detalle_urbanizacion
JOIN producto ON producto.idProducto = detalle_urbanizacion.idProducto
JOIN manzana ON manzana.idManzana = detalle_urbanizacion.idManzana
WHERE idUrbanizacion = ?`;

    // Realiza ambas consultas en paralelo
    sql.query(queryCabecera, [numeroFactura], (errCabecera, resCabecera) => {
        if (errCabecera) {
            console.log("error: ", errCabecera);
            result(errCabecera, null);
            return;
        }

        // Si la cabecera se encuentra, realiza la consulta del detalle_urbanizacion
        if (resCabecera.length) {
            const idUrbanizacion = resCabecera[0].idUrbanizacion;

            sql.query(queryDetalle, [idUrbanizacion], (errDetalle, resDetalle) => {
                if (errDetalle) {
                    console.log("error: ", errDetalle);
                    result(errDetalle, null);
                    return;
                }

                // Combina la cabecera y el detalle_urbanizacion en un solo objeto
                const CompraC = {
                    ...resCabecera[0],
                    detalle_urbanizacionetalle: resDetalle,
                };

                console.log("found urbanizacion: ", CompraC);
                result(null, CompraC);
            });
        } else {
            // No se encontró la urbanizacion con el id proporcionado
            result({ kind: "not_found" }, null);
        }
    });
};

Urbanizacion.getAll = (id, result) => {
    let query = 
    `SELECT idUrbanizacion,
    urbanizacion.Nombre_Urbanizacion,
    urbanizacion.fecha_urb,
    urbanizacion.Ubicacion,
    urbanizacion.idCiudad,
    ciudad.Descripcion as nombreciudad,
    urbanizacion.idBarrio,
    barrio.descripcion as nombrebarrio,
    urbanizacion.Costo_total,
    urbanizacion.idStock_Lote,
    urbanizacion.estado
FROM urbanizacion
JOIN ciudad ON ciudad.idCiudad = urbanizacion.idCiudad
JOIN barrio ON barrio.idBarrio= urbanizacion.idBarrio`;

    let queryDetalle =
        `SELECT idUrbanizacion,
        detalle_urbanizacion.idProducto,
        detalle_urbanizacion.id_detalle,
        detalle_urbanizacion.idManzana,
        manzana.Descripcion as nombremanzana,
        detalle_urbanizacion.Numero_lote,
        detalle_urbanizacion.ancho_frente,
        detalle_urbanizacion.ancho_atras,
        detalle_urbanizacion.long_izquierdo,
        detalle_urbanizacion.long_derecho,
        detalle_urbanizacion.costo_urbanizacion
    FROM detalle_urbanizacion
    JOIN producto ON producto.idProducto = detalle_urbanizacion.idProducto
	JOIN manzana ON manzana.idManzana = detalle_urbanizacion.idManzana
    WHERE idUrbanizacion =  ?`;

    if (id) {
        query += ` WHERE idUrbanizacion = ${id}`;
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
                    [cabecera.idUrbanizacion],
                    async (err2, res2) => {
                        if (err2) {
                            console.log("error: ", err);
                            return;
                        }
                        resolver(res2);
                    })
            })

            const detalle_urbanizacion = await promesa

            cabeceraConDetalle.push({
                ...cabecera,
                detalle_urbanizacion: detalle_urbanizacion
            })
        }

        console.log("urbanizacion: ", cabeceraConDetalle);
        result(null, cabeceraConDetalle);
    });
};


Urbanizacion.update = (id, result) => {
    console.log("Updating state of urbanizacion with ID: ", id);


    // Actualizar el estado de urbanizacion a true
    sql.query("UPDATE urbanizacion SET estado_compras = true WHERE idUrbanizaciones = ?", [id], (e2, res) => {
        if (e2) {
            console.log("error updating urbanizacion: ", e2);
            result(e2, null);
            return;
        }

        if (res.affectedRows == 0) {
            // No se encontró la compra con el ID
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("Updated state of urbanizacion with ID: ", id);
        result(null, res);


    });
};

module.exports = Urbanizacion;


