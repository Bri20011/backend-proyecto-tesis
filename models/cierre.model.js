const sql = require("../db.js");


// constructord
const Cierre = function (cierre) {
    this.idCierre_caja = cierre.idCierre_caja;
    this.monto_final = cierre.monto_final;
    this.idAperturacaja = cierre.idAperturacaja;
    this.monto_apertura = cierre.monto_apertura;
    this.fecha_hora_apertura = cierre.fecha_hora_apertura;

};

Cierre.create = (newCierre, result) => {
    sql.query("SELECT idCierre_caja as id FROM cierre_caja ORDER BY idCierre_caja DESC LIMIT 1", null, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO cierre_caja (idCierre_caja, monto_final, idAperturacaja, monto_apertura, fecha_hora_apertura) VALUES (?, ?, ?, ?, ?)",
            [newId, newCierre.monto_final, newCierre.idAperturacaja, newCierre.monto_apertura, newCierre.fecha_hora_apertura], (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                    return;
                }


                result(null, { ...newCierre });
            });
    })
};

Cierre.findById = (id, result) => {
    sql.query(`SELECT * FROM cierre_caja WHERE idCierre_caja = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found cierre_caja: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Cierre with the id
        result({ kind: "not_found" }, null);
    });
};

Cierre.getAll = (id, result) => {
    let query = `SELECT idCierre_caja,
    cierre_caja.monto_final,
    cierre_caja.idAperturacaja,
    cierre_caja.monto_apertura,
    cierre_caja.fecha_hora_apertura
FROM cierre_caja`;

    if (id) {
        query += ` WHERE idCierre_caja = ${id}`;
    }

    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("cierre_caja: ", res);
        result(null, res);
    });
};


Cierre.updateById = (id, cierre_caja, result) => {
    sql.query(
        "UPDATE cierre_caja SET monto_final = ?, idAperturacaja = ?, monto_apertura = ?, fecha_hora_apertura = ? WHERE idCierre_caja = ?",
        [cierre_caja.monto_final, cierre_caja.idAperturacaja, cierre_caja.monto_apertura, cierre_caja.fecha_hora_apertura, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Cierre with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated cierre_caja: ", { ...cierre_caja });
            result(null, { ...cierre_caja });
        }
    );
};

Cierre.remove = (id, result) => {
    sql.query("DELETE FROM cierre_caja WHERE idCierre_caja = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found Cierre with the id
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted Cierre with id: ", id);
        result(null, res);
    });
};


module.exports = Cierre;