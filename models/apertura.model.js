const sql = require("../db.js");


// constructord
const Apertura = function (aperturacaja) {
    this.idAperturacaja = aperturacaja.idAperturacaja;
    this.Fechahoraapertura = aperturacaja.Fechahoraapertura;
    this.Monto_Inicial = aperturacaja.Monto_Inicial;
    this.idCaja = aperturacaja.idCaja;
    this.idUsuario = aperturacaja.idUsuario;

};

Apertura.create = (newAperturacaja, result) => {
    sql.query("SELECT idAperturacaja as id FROM aperturacaja ORDER BY idAperturacaja DESC LIMIT 1", null, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO aperturacaja (idAperturacaja, Fechahoraapertura, Monto_Inicial, idCaja, idUsuario) VALUES (?, ?, ?, ?, ?)",
            [newId, newAperturacaja.Fechahoraapertura, newAperturacaja.Monto_Inicial, newAperturacaja.idCaja, newAperturacaja.idUsuario], (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                    return;
                }


                result(null, { ...newAperturacaja });
            });
    })
};

Apertura.findById = (id, result) => {
    sql.query(`SELECT * FROM aperturacaja WHERE idAperturacaja = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found aperturacaja: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Apertura with the id
        result({ kind: "not_found" }, null);
    });
};

Apertura.getAll = (id, result) => {
    let query = `SELECT idAperturacaja,
    aperturacaja.Fechahoraapertura,
    aperturacaja.Monto_Inicial,
    caja.idCaja,
    caja.Cajahabilitada as numeroCaja,
    aperturacaja.idUsuario,
    usuario.Nombre as nombreusuario
FROM aperturacaja
JOIN caja ON caja.idCaja = aperturacaja.idCaja
JOIN usuario ON usuario.idUsuario = aperturacaja.idUsuario`;

    if (id) {
        query += ` WHERE idAperturacaja = ${id}`;
    }

    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("aperturacaja: ", res);
        result(null, res);
    });
};


Apertura.updateById = (id, aperturacaja, result) => {
    sql.query(
        "UPDATE aperturacaja SET Fechahoraapertura = ?, Monto_Inicial = ?, idCaja = ?, idUsuario = ? WHERE idAperturacaja = ?",
        [aperturacaja.Fechahoraapertura, aperturacaja.Monto_Inicial, aperturacaja.idCaja, aperturacaja.idUsuario, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Apertura with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated aperturacaja: ", { ...aperturacaja });
            result(null, { ...aperturacaja });
        }
    );
};

Apertura.remove = (id, result) => {
    sql.query("DELETE FROM aperturacaja WHERE idAperturacaja = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found Apertura with the id
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted Apertura with id: ", id);
        result(null, res);
    });
};


module.exports = Apertura;