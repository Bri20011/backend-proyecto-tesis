const sql = require("../db.js");


// constructord
const Usuario = function (usuario) {
    this.idUsuario = usuario.idUsuario;
    this.nombre = usuario.Nombre;
    this.contrasehna = usuario.Contrasehna;
    this.idSucursal = usuario.idSucursal;
    this.idFuncionario = usuario.idFuncionario;
    this.idNivel = usuario.idNivel;
};

Usuario.create = (newUsuario, result) => {
    sql.query("SELECT idUsuario as id FROM usuario ORDER BY idUsuario DESC LIMIT 1", null, (err, res)=> {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO usuario (idUsuario, nombre, contrasehna, idSucursal,idFuncionario,idNivel) VALUES (?, ?, ?, ?, ?, ?)", [newId, newUsuario.nombre, newUsuario.contrasehna, newUsuario.idSucursal, newUsuario.idFuncionario, newUsuario.idNivel], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
    
            
            result(null, { ...newUsuario });
        });
    })
};

Usuario.findById = (id, result) => {
    sql.query(`SELECT * FROM usuario WHERE idUsuario = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found usuario: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Usuario with the id
        result({ kind: "not_found" }, null);
    });
};

Usuario.findByUserAndPassword = (usuario, result) => {
    sql.query(`SELECT * FROM usuario WHERE Contrasehna = '${usuario.contrasehna}' and Nombre = '${usuario.nombre}'`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found usuario: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Usuario with the id
        result({ kind: "not_found" }, null);
    });
};

Usuario.getAll = (id, result) => {
    let query = `SELECT idUsuario,
    usuario.Nombre,
    usuario.Contrasehna,
    usuario.idSucursal,
    sucursal.idSucursal as nombreSucursal,
    usuario.idFuncionario,
    funcionario.idFuncionario as nombrefuncionario,
    usuario.idNivel,
    nivel.idNivel as nombrenivel
FROM usuario
JOIN sucursal ON usuario.idSucursal = sucursal.idSucursal
JOIN funcionario ON usuario.idFuncionario = funcionario.idFuncionario
JOIN nivel ON usuario.idNivel = nivel.idNivel`;

    if (id) {
        query += ` WHERE idUsuario = ${id}`;
    }

    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("usuario: ", res);
        result(null, res);
    });
};


Usuario.updateById = (id, usuario, result) => {   
    sql.query(
        "UPDATE usuario SET nombre = ?, Contrasehna = ?, idSucursal = ? , idFuncionario = ? , idNivel = ? WHERE idUsuario = ?",
        [usuario.nombre, usuario.Contrasehna, usuario.idSucursal, usuario.idFuncionario, usuario.idNivel, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Usuario with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated usuario: ", { ...usuario });
            result(null, { ...usuario });
        }
    );
};

Usuario.remove = (id, result) => {
    sql.query("DELETE FROM usuario WHERE idUsuario = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found Usuario with the id
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted usuario with id: ", id);
        result(null, res);
    });
};


module.exports = Usuario;