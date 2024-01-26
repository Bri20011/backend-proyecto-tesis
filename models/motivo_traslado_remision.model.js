const sql = require("../db.js");


// constructor
const MotivoTraslado = function(motivo_traslado_remision) {
    this.idmotivo_traslado_remision = motivo_traslado_remision.idmotivo_traslado_remision;
    this.descripcion = motivo_traslado_remision.Descripcion;
  };
  
  MotivoTraslado.create = (newMotivoMotivoTraslado, result) => {
    sql.query("SELECT idmotivo_traslado_remision as id FROM motivo_traslado_remision ORDER BY idmotivo_traslado_remision DESC LIMIT 1", null, (err, res)=> {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO motivo_traslado_remision (idmotivo_traslado_remision, Descripcion)  VALUES (?, ?)", [newId, newMotivoMotivoTraslado.descripcion], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
    
            
            result(null, { ...newMotivoMotivoTraslado });
        });
    })
};

  
  
MotivoTraslado.findById = (id, result) => {
    sql.query(`SELECT * FROM motivo_traslado_remision WHERE idmotivo_traslado_remision = ${id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found motivo_traslado_remision: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found MotivoTraslado with the id
      result({ kind: "not_found" }, null);
    });
  };
  



  MotivoTraslado.getAll = (id, result) => {
    let query = "SELECT * FROM motivo_traslado_remision";
  
    if (id) {
      query += ` WHERE idmotivo_traslado_remision = ${id}`;
    }
  
    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("motivo_traslado_remision: ", res);
      result(null, res);
    });
  };
 
 
  MotivoTraslado.updateById = (id, motivo_traslado_remision, result) => {
    sql.query(
      "UPDATE motivo_traslado_remision SET Descripcion = ? WHERE idmotivo_traslado_remision = ?",
      [motivo_traslado_remision.descripcion, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found MotivoTraslado with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated motivo_traslado_remision: ", {...motivo_traslado_remision });
        result(null, { ...motivo_traslado_remision });
      }
    );
  };
  
  MotivoTraslado.remove = (id, result) => {
    sql.query("DELETE FROM motivo_traslado_remision WHERE idmotivo_traslado_remision = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found MotivoTraslado with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted motivo_traslado_remision with id: ", id);
      result(null, res);
    });
  };
  
  
  module.exports = MotivoTraslado;