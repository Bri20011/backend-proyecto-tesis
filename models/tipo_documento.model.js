const sql = require("../db.js");


// constructor
const Tipo_Documento = function(tipo_documento) {
    this.idTipo_Documento = tipo_documento.idTipo_Documento;
    this.descripcion = tipo_documento.Descripcion;
  };
  

  Tipo_Documento.create = (newTipo_Documento, result) => {
    sql.query("SELECT idTipo_Documento as id FROM tipo_documento ORDER BY idTipo_Documento DESC LIMIT 1", null, (err, res)=> {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO tipo_documento (idTipo_Documento, descripcion)  VALUES (?, ?)", [newId, newTipo_Documento.descripcion], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
    
            
            result(null, { ...newTipo_Documento });
        });
    })
};



  Tipo_Documento.findById = (id, result) => {
    sql.query(`SELECT * FROM tipo_documento WHERE idTipo_Documento = ${id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found idTipo_Documento: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found Tipo_Documento with the id
      result({ kind: "not_found" }, null);
    });
  };
  
  Tipo_Documento.getAll = (id, result) => {
    let query = "SELECT * FROM tipo_documento";
  
    if (id) {
      query += ` WHERE idTipo_Documento = ${id}`;
    }
  
    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("tipo_documento: ", res);
      result(null, res);
    });
  };
 
 
  Tipo_Documento.updateById = (id, tipo_documento, result) => {
    sql.query(
      "UPDATE tipo_documento SET descripcion = ? WHERE idTipo_Documento = ?",
      [tipo_documento.descripcion, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found Tipo_Documento with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated tipo_documento: ", {...tipo_documento });
        result(null, { ...tipo_documento });
      }
    );
  };
  
  Tipo_Documento.remove = (id, result) => {
    sql.query("DELETE FROM tipo_documento WHERE idTipo_Documento = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found Tipo_Documento with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted tipo_documento with id: ", id);
      result(null, res);
    });
  };
  
  
  module.exports = Tipo_Documento;