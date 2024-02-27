const sql = require("../db.js");


// constructor
const TipoProducto = function(tipo_producto) {
    this.idtipo_producto = tipo_producto.idtipo_producto;
    this.descripcion = tipo_producto.descripcion;
  };
  
  TipoProducto.create = (newTipoProducto, result) => {
    sql.query("SELECT idtipo_producto as id FROM tipo_producto ORDER BY idtipo_producto DESC LIMIT 1", null, (err, res)=> {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO tipo_producto (idtipo_producto, descripcion)  VALUES (?, ?)", [newId, newTipoProducto.descripcion], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
    
            
            result(null, { ...newTipoProducto });
        });
    })
};

  
  
TipoProducto.findById = (id, result) => {
    sql.query(`SELECT * FROM tipo_producto WHERE idtipo_producto = ${id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found tipo_producto: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found TipoProducto with the id
      result({ kind: "not_found" }, null);
    });
  };
  



  TipoProducto.getAll = (id, result) => {
    let query = "SELECT * FROM tipo_producto";
  
    if (id) {
      query += ` WHERE idtipo_producto = ${id}`;
    }
  
    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("tipo_producto: ", res);
      result(null, res);
    });
  };
 
 
  TipoProducto.updateById = (id, tipo_producto, result) => {
    sql.query(
      "UPDATE tipo_producto SET descripcion = ? WHERE idtipo_producto = ?",
      [tipo_producto.descripcion, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found TipoProducto with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated tipo_producto: ", {...tipo_producto });
        result(null, { ...tipo_producto });
      }
    );
  };
  
  TipoProducto.remove = (id, result) => {
    sql.query("DELETE FROM tipo_producto WHERE idtipo_producto = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found TipoProducto with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted tipo_producto with id: ", id);
      result(null, res);
    });
  };
  
  
  module.exports = TipoProducto;