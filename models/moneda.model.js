const sql = require("../db.js");


// constructor
const Moneda = function(moneda) {
    this.idmoneda = moneda.idmoneda;
    this.Descripcion = moneda.Descripcion;
  };
  
  Moneda.create = (newMoneda, result) => {
    sql.query("SELECT idmoneda as id FROM moneda ORDER BY idmoneda DESC LIMIT 1", null, (err, res)=> {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO moneda (idmoneda, Descripcion)  VALUES (?, ?)", [newId, newMoneda.Descripcion], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
    
            
            result(null, { ...newMoneda });
        });
    })
};

  
  
Moneda.findById = (id, result) => {
    sql.query(`SELECT * FROM moneda WHERE idmoneda = ${id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found moneda: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found Moneda with the id
      result({ kind: "not_found" }, null);
    });
  };
  



  Moneda.getAll = (id, result) => {
    let query = "SELECT * FROM moneda";
  
    if (id) {
      query += ` WHERE idmoneda = ${id}`;
    }
  
    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("moneda: ", res);
      result(null, res);
    });
  };
 
 
  Moneda.updateById = (id, moneda, result) => {
    sql.query(
      "UPDATE moneda SET Descripcion = ? WHERE idmoneda = ?",
      [moneda.Descripcion, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found Moneda with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated moneda: ", {...moneda });
        result(null, { ...moneda });
      }
    );
  };
  
  Moneda.remove = (id, result) => {
    sql.query("DELETE FROM moneda WHERE idmoneda = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found Moneda with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted moneda with id: ", id);
      result(null, res);
    });
  };
  
  
  module.exports = Moneda;