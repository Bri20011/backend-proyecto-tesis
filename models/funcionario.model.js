const sql = require("../db.js");


// constructord
const Funcionario = function (funcionario) {
    this.idFuncionario = funcionario.idFuncionario;
    this.nombres = funcionario.nombres;
    this.apellidos = funcionario.apellidos;
    this.Direccion = funcionario.Direccion;
    this.Telefono = funcionario.Telefono;
    this.idBarrio = funcionario.idBarrio;
    this.idCiudad = funcionario.idCiudad;
};

Funcionario.create = (newFuncionario, result) => {
    sql.query("SELECT idFuncionario as id FROM funcionario ORDER BY idFuncionario DESC LIMIT 1", null, (err, res)=> {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO funcionario (idFuncionario, nombres, apellidos, Direccion, Telefono, idBarrio, idCiudad) VALUES (?, ?, ?, ?, ?, ?, ?)", [newId, newFuncionario.nombres, newFuncionario.apellidos, newFuncionario.Direccion, newFuncionario.Telefono, newFuncionario.idBarrio, newFuncionario.idCiudad], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
    
            
            result(null, { ...newFuncionario });
        });
    })
};

Funcionario.findById = (id, result) => {
    sql.query(`SELECT * FROM funcionario WHERE idFuncionario = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found funcionario: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Funcionario with the id
        result({ kind: "not_found" }, null);
    });
};

Funcionario.getAll = (id, result) => {
    let query = `SELECT idFuncionario,
    funcionario.nombres,
    funcionario.apellidos,
    funcionario.Direccion,
    funcionario.Telefono,
    funcionario.idBarrio,
    barrio.descripcion as nombrebarrio,
    funcionario.idCiudad,
    ciudad.descripcion as nombreciudad
FROM funcionario
JOIN barrio ON barrio.idBarrio = funcionario.idFuncionario
JOIN ciudad ON ciudad.idCiudad = funcionario.idCiudad;`;

    if (id) {
        query += ` WHERE idFuncionario = ${id}`;
    }

    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("funcionario: ", res);
        result(null, res);
    });
};


Funcionario.updateById = (id, funcionario, result) => {   
    sql.query(
        "UPDATE funcionario SET nombres = ?, apellidos = ?, Direccion = ? , Telefono = ? , idBarrio = ?, idCiudad = ? WHERE idFuncionario = ?",
                    [funcionario.nombres, funcionario.apellidos, funcionario.Direccion, funcionario.Telefono, funcionario.idBarrio, funcionario.idCiudad, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Funcionario with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated funcionario: ", { ...funcionario });
            result(null, { ...funcionario });
        }
    );
};

Funcionario.remove = (id, result) => {
    sql.query("DELETE FROM funcionario WHERE idFuncionario = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found Funcionario with the id
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted Funcionario with id: ", id);
        result(null, res);
    });
};


module.exports = Funcionario;