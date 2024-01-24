const sql = require("../db.js");


// constructor
const TipoVenta = function(tipo_venta) {
    this.idtipo_venta = tipo_venta.idtipo_venta;
    this.descripcion = tipo_venta.Descripcion;
  };
  
  TipoVenta.create = (newTipoVenta, result) => {
    sql.query("SELECT idtipo_venta as id FROM tipo_venta ORDER BY idtipo_venta DESC LIMIT 1", null, (err, res)=> {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO tipo_venta (idtipo_venta, descripcion)  VALUES (?, ?)", [newId, newTipoVenta.descripcion], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
    
            
            result(null, { ...newTipoVenta });
        });
    })
};

  
  
TipoVenta.findById = (id, result) => {
    sql.query(`SELECT * FROM tipo_venta WHERE idtipo_venta = ${id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found tipo_venta: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found TipoVenta with the id
      result({ kind: "not_found" }, null);
    });
  };
  



  TipoVenta.getAll = (id, result) => {
    let query = "SELECT * FROM tipo_venta";
  
    if (id) {
      query += ` WHERE idtipo_venta = ${id}`;
    }
  
    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("tipo_venta: ", res);
      result(null, res);
    });
  };
 
 
  TipoVenta.updateById = (id, tipo_venta, result) => {
    sql.query(
      "UPDATE tipo_venta SET descripcion = ? WHERE idtipo_venta = ?",
      [tipo_venta.descripcion, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found TipoVenta with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated tipoventa: ", {...tipo_venta });
        result(null, { ...tipo_venta });
      }
    );
  };
  
  TipoVenta.remove = (id, result) => {
    sql.query("DELETE FROM tipo_venta WHERE idtipo_venta = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found TipoVenta with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted tipoventa with id: ", id);
      result(null, res);
    });
  };
  
  
  module.exports = TipoVenta;