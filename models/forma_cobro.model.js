const sql = require("../db.js");


// constructor
const FormaCobro = function(forma_cobro) {
    this.idforma_cobro = forma_cobro.idforma_cobro;
    this.descripcion = forma_cobro.Descripcion;
  };
  
  FormaCobro.create = (newFormaCobro, result) => {
    sql.query("SELECT idforma_cobro as id FROM forma_cobro ORDER BY idforma_cobro DESC LIMIT 1", null, (err, res)=> {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO forma_cobro (idforma_cobro, Descripcion)  VALUES (?, ?)", [newId, newFormaCobro.descripcion], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
    
            
            result(null, { ...newFormaCobro });
        });
    })
};

  
  
FormaCobro.findById = (id, result) => {
    sql.query(`SELECT * FROM forma_cobro WHERE idforma_cobro = ${id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found forma_cobro: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found FormaCobro with the id
      result({ kind: "not_found" }, null);
    });
  };
  



  FormaCobro.getAll = (id, result) => {
    let query = "SELECT * FROM forma_cobro";
  
    if (id) {
      query += ` WHERE idforma_cobro = ${id}`;
    }
  
    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("forma_cobro: ", res);
      result(null, res);
    });
  };
 
 
  FormaCobro.updateById = (id, forma_cobro, result) => {
    sql.query(
      "UPDATE forma_cobro SET Descripcion = ? WHERE idforma_cobro = ?",
      [forma_cobro.descripcion, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found FormaCobro with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated forma_cobro: ", {...forma_cobro });
        result(null, { ...forma_cobro });
      }
    );
  };
  
  FormaCobro.remove = (id, result) => {
    sql.query("DELETE FROM forma_cobro WHERE idforma_cobro = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found FormaCobro with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted forma_cobro with id: ", id);
      result(null, res);
    });
  };
  
  
  module.exports = FormaCobro;