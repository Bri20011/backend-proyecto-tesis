const sql = require("../db.js");


// constructor
const MotivoCesion = function(motivo_cesion_derecho_deuda) {
    this.idmotivo_cesion_derecho_deuda = motivo_cesion_derecho_deuda.idmotivo_cesion_derecho_deuda;
    this.descripcion = motivo_cesion_derecho_deuda.Descripcion;
  };
  
  MotivoCesion.create = (newMotivoCesion, result) => {
    sql.query("SELECT idmotivo_cesion_derecho_deuda as id FROM motivo_cesion_derecho_deuda ORDER BY idmotivo_cesion_derecho_deuda DESC LIMIT 1", null, (err, res)=> {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO motivo_cesion_derecho_deuda (idmotivo_cesion_derecho_deuda, descripcion)  VALUES (?, ?)", [newId, newMotivoCesion.descripcion], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
    
            
            result(null, { ...newMotivoCesion });
        });
    })
};

  
  
MotivoCesion.findById = (id, result) => {
    sql.query(`SELECT * FROM motivo_cesion_derecho_deuda WHERE idmotivo_cesion_derecho_deuda = ${id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found motivo_cesion_derecho_deuda: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found MotivoCesion with the id
      result({ kind: "not_found" }, null);
    });
  };
  



  MotivoCesion.getAll = (id, result) => {
    let query = "SELECT * FROM motivo_cesion_derecho_deuda";
  
    if (id) {
      query += ` WHERE idmotivo_cesion_derecho_deuda = ${id}`;
    }
  
    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("motivo_cesion_derecho_deuda: ", res);
      result(null, res);
    });
  };
 
 
  MotivoCesion.updateById = (id, motivo_cesion_derecho_deuda, result) => {
    sql.query(
      "UPDATE motivo_cesion_derecho_deuda SET descripcion = ? WHERE idmotivo_cesion_derecho_deuda = ?",
      [motivo_cesion_derecho_deuda.descripcion, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found MotivoCesion with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated motivo_cesion_derecho_deuda: ", {...motivo_cesion_derecho_deuda });
        result(null, { ...motivo_cesion_derecho_deuda });
      }
    );
  };
  
  MotivoCesion.remove = (id, result) => {
    sql.query("DELETE FROM motivo_cesion_derecho_deuda WHERE idmotivo_cesion_derecho_deuda = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found MotivoCesion with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted motivo_cesion_derecho_deuda with id: ", id);
      result(null, res);
    });
  };
  
  
  module.exports = MotivoCesion;