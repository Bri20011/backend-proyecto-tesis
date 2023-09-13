const sql = require("../db.js");


// constructor
const Establecimiento = function (establecimiento) {
    this.idEstablecimiento = establecimiento.idEstablecimiento;
    this.descripcion = establecimiento.Descripcion;
    this.numero_establec = establecimiento.Numero_establec;
};

Establecimiento.create = (newEstablecimiento, result) => {

    sql.query("INSERT INTO establecimiento (idEstablecimiento, descripcion, numero_establec) VALUES (?, ?, ?)", [newEstablecimiento.idEstablecimiento, newEstablecimiento.descripcion, newEstablecimiento.numero_establec], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created establecimiento: ", { ...newEstablecimiento });
        result(null, { ...newEstablecimiento });
    });
};

Establecimiento.findById = (id, result) => {
    sql.query(`SELECT * FROM establecimiento WHERE idEstablecimiento = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found establecimiento: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Establecimiento with the id
        result({ kind: "not_found" }, null);
    });
};

Establecimiento.getAll = (id, result) => {
    let query = "SELECT * FROM establecimiento";

    if (id) {
        query += ` WHERE idEstablecimiento = ${id}`;
    }

    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("establecimiento: ", res);
        result(null, res);
    });
};


Establecimiento.updateById = (id, establecimiento, result) => {   //agregar en esta linea si hay error, numer_establec
    sql.query(
        "UPDATE establecimiento SET descripcion = ?, Numero_establec = ? WHERE idEstablecimiento = ?",
        [establecimiento.descripcion, establecimiento.numero_establec, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Establecimiento with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated establecimiento: ", { ...establecimiento });
            result(null, { ...establecimiento });
        }
    );
};

Establecimiento.remove = (id, result) => {
    sql.query("DELETE FROM establecimiento WHERE idEstablecimiento = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found Establecimiento with the id
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted establecimiento with id: ", id);
        result(null, res);
    });
};


module.exports = Establecimiento;