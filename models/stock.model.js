const sql = require("../db.js");


// constructord
const Stock = function (stock) {
};


Stock.update = (parametro_id_producto, parametro_cantidad, parametro_operacion) => {

  // parametro_id_producto: Es el id del producto
  // parametro_cantidad: Es la cantidad a registrar
  // parametro_operacion: Tipo de operacion si es "true" es SUMA, "false" es RESTA

  let aux_cantidad;
  

  sql.query("SELECT idStock as id, idProducto, Cantidad FROM stock WHERE idProducto = ?;", [parametro_id_producto], (err, res) => {
    if (err) {
      console.log("error: ", err);
      return;
    }

    let existStock = res[0]?.id || 0
    aux_cantidad = res[0]?.Cantidad || 0

    if (parametro_operacion) {
      aux_cantidad = aux_cantidad + parametro_cantidad
    } else {
      aux_cantidad = aux_cantidad - parametro_cantidad
    }

    // Si currentId es 0 significa que no existe el stock y se procede a crear
    if (existStock === 0) {
        sql.query("INSERT INTO stock (idProducto, Cantidad) VALUES ( ?, ?);",
        [ parametro_id_producto, aux_cantidad], (err, res) => {
          if (err) {
            console.log("error: ", err);
            return;
          }
        });
    // Si ya existe solo se actualize el stock
    } else {
      sql.query("UPDATE stock SET Cantidad = ? WHERE idProducto = ?",
        [aux_cantidad, parametro_id_producto], (err, res) => {
          if (err) {
            console.log("error: ", err);
            return;
          }
        });
    }
  })
};

module.exports = Stock;


