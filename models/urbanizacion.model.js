const sql = require("../db.js");


// constructord
const Urbanizacion = function (urbanizacion) {
    this.idUrbanizacion = urbanizacion.idUrbanizacion;
    this.fecha_urb = urbanizacion.fecha_urb;
    this.Nombre_Urbanizacion = urbanizacion.Nombre_Urbanizacion;
    this.Area = urbanizacion.Area;
    this.LadoA = urbanizacion.LadoA;
    this.LadoB = urbanizacion.LadoB;
    this.Cantidad_manzana = urbanizacion.Cantidad_manzana;
    this.Ubicacion = urbanizacion.Ubicacion;
    this.Precio = urbanizacion.Precio;
    this.idCiudad = urbanizacion.idCiudad;
    this.idCompras = urbanizacion.idCompras;
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

        sql.query("INSERT INTO urbanizacion (idUrbanizacion, idCompras, fecha_urb, Nombre_Urbanizacion, Area, LadoA, LadoB, Cantidad_manzana, Ubicacion, Precio, idCiudad ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [newId, newUrbanizacion.idCompras, newUrbanizacion.fecha_urb, newUrbanizacion.Nombre_Urbanizacion, newUrbanizacion.Area, newUrbanizacion.LadoA, newUrbanizacion.LadoB, newUrbanizacion.Cantidad_manzana, newUrbanizacion.Ubicacion, newUrbanizacion.Precio, newUrbanizacion.idCiudad], (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                    return;
                }

                const detalleFormateado = []
                newUrbanizacion.Detalle.forEach(detalle => {
                    detalleFormateado.push(
                        [newId, detalle.idProducto, detalle.Ubicacion, detalle.Numero_manzana, detalle.Numero_lote, detalle.Area, detalle.Precio_Lote]
                    )
                })

                sql.query(`INSERT INTO detalle_urbanizacion (idUrbanizacion, idProducto, Ubicacion, Numero_manzana, Numero_lote, Area, Precio_Lote ) VALUES ?`,
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
	producto.Descripcion as nombreProducto,
    detalle_urbanizacion.Ubicacion,
    detalle_urbanizacion.Numero_manzana,
    detalle_urbanizacion.Numero_lote,
    detalle_urbanizacion.Area,
    detalle_urbanizacion.Precio_Lote
FROM detalle_urbanizacion
JOIN producto ON producto.idProducto = detalle_urbanizacion.idProducto
WHERE idUrbanizacion = ?`;

    // Realiza ambas consultas en paralelo
    sql.query(queryCabecera, [numeroFactura], (errCabecera, resCabecera) => {
        if (errCabecera) {
            console.log("error: ", errCabecera);
            result(errCabecera, null);
            return;
        }

        // Si la cabecera se encuentra, realiza la consulta del detalle
        if (resCabecera.length) {
            const idUrbanizacion = resCabecera[0].idUrbanizacion;

            sql.query(queryDetalle, [idUrbanizacion], (errDetalle, resDetalle) => {
                if (errDetalle) {
                    console.log("error: ", errDetalle);
                    result(errDetalle, null);
                    return;
                }

                // Combina la cabecera y el detalle en un solo objeto
                const CompraC = {
                    ...resCabecera[0],
                    detalle: resDetalle,
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
    let query = "SELECT * FROM urbanizacion WHERE idUrbanizacion";

    let queryDetalle =
        `SELECT idUrbanizacion,
        detalle_urbanizacion.idProducto,
        producto.Descripcion as nombreProducto,
        detalle_urbanizacion.Ubicacion,
        detalle_urbanizacion.Numero_manzana,
        detalle_urbanizacion.Numero_lote,
        detalle_urbanizacion.Area,
        detalle_urbanizacion.Precio_Lote
    FROM detalle_urbanizacion
    JOIN producto ON producto.idProducto = detalle_urbanizacion.idProducto
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

            const detalle = await promesa

            cabeceraConDetalle.push({
                ...cabecera,
                detalle: detalle
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


