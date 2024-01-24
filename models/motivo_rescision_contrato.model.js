const sql = require("../db.js");


// constructor
const MotivoRescision = function(motivo_rescision_contrato) {
    this.idmotivo_rescision_contrato = motivo_rescision_contrato.idmotivo_rescision_contrato;
    this.descripcion = motivo_rescision_contrato.Descripcion;
  };
  
  MotivoRescision.create = (newMotivoRescision, result) => {
    sql.query("SELECT idmotivo_rescision_contrato as id FROM motivo_rescision_contrato ORDER BY idmotivo_rescision_contrato DESC LIMIT 1", null, (err, res)=> {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO motivo_rescision_contrato (idmotivo_rescision_contrato, descripcion)  VALUES (?, ?)", [newId, newMotivoRescision.descripcion], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
    
            
            result(null, { ...newMotivoRescision });
        });
    })
};

  
  
MotivoRescision.findById = (id, result) => {
    sql.query(`SELECT * FROM motivo_rescision_contrato WHERE idmotivo_rescision_contrato = ${id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found motivo_rescision_contrato: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found MotivoRescision with the id
      result({ kind: "not_found" }, null);
    });
  };
  



  MotivoRescision.getAll = (id, result) => {
    let query = "SELECT * FROM motivo_rescision_contrato";
  
    if (id) {
      query += ` WHERE idmotivo_rescision_contrato = ${id}`;
    }
  
    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("motivo_rescision_contrato: ", res);
      result(null, res);
    });
  };
 
 
  MotivoRescision.updateById = (id, motivo_rescision_contrato, result) => {
    sql.query(
      "UPDATE motivo_rescision_contrato SET descripcion = ? WHERE idmotivo_rescision_contrato = ?",
      [motivo_rescision_contrato.descripcion, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found MotivoRescision with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated motivo_rescision_contrato: ", {...motivo_rescision_contrato });
        result(null, { ...motivo_rescision_contrato });
      }
    );
  };
  
  MotivoRescision.remove = (id, result) => {
    sql.query("DELETE FROM motivo_rescision_contrato WHERE idmotivo_rescision_contrato = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found MotivoRescision with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted motivo_rescision_contrato with id: ", id);
      result(null, res);
    });
  };
  
  
  module.exports = MotivoRescision;