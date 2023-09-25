const sql = require("../db.js");


// constructor
const Marca = function(marca) {
    this.idmarca = marca.idmarca;
    this.descripcion = marca.Descripcion;
  };
  




  Marca.create = (newMarca, result) => {
    sql.query("SELECT idmarca as id FROM marca ORDER BY idmarca DESC LIMIT 1", null, (err, res)=> {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO marca (idmarca, descripcion)  VALUES (?, ?)", [newId, newMarca.descripcion], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
    
            
            result(null, { ...newMarca});
        });
    })
};
  


  Marca.findById = (id, result) => {
    sql.query(`SELECT * FROM marca WHERE idmarca = ${id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found marca: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found marca with the id
      result({ kind: "not_found" }, null);
    });
  };
  
  Marca.getAll = (id, result) => {
    let query = "SELECT * FROM marca";
  
    if (id) {
      query += ` WHERE idmarca = ${id}`;
    }
  
    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("marca: ", res);
      result(null, res);
    });
  };
 
 
  Marca.updateById = (id, marca, result) => {
    sql.query(
      "UPDATE marca SET descripcion = ? WHERE idmarca = ?",
      [marca.descripcion, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found Marca with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated marca: ", {...marca });
        result(null, { ...marca });
      }
    );
  };
  
  Marca.remove = (id, result) => {
    sql.query("DELETE FROM marca WHERE idmarca = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found Marca with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted marca with id: ", id);
      result(null, res);
    });
  };
  
  
  module.exports = Marca;