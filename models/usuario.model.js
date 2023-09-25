const sql = require("../db.js");


// constructord
const Usuario = function (usuario) {
    this.idUsuario = usuario.idUsuario;
    this.nombre = usuario.Nombre;
    this.contrasehna = usuario.Contrasehna;
    this.idSucursal = usuario.idSucursal;
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

        sql.query("INSERT INTO usuario (idUsuario, nombre, contrasehna, idSucursal) VALUES (?, ?, ?, ?)", [newId, newUsuario.nombre, newUsuario.contrasehna, newUsuario.idSucursal], (err, res) => {
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

Usuario.getAll = (id, result) => {
    let query = `SELECT 
    idUsuario,
    Nombre,
    Contrasehna,
    sucursal.idSucursal,
    sucursal.descripcion as nombreSucursal
   FROM usuario JOIN sucursal ON sucursal.idSucursal = usuario.idSucursal`;

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
        "UPDATE usuario SET nombre = ?, Contrasehna = ?, idSucursal = ? WHERE idUsuario = ?",
        [usuario.nombre, usuario.Contrasehna, usuario.idSucursal, id],
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