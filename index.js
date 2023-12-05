const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const dbConfig = require("./config/db.config.js");

const app = express();

var corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

require("./routes/ciudad.routes.js")(app);
require("./routes/barrio.routes.js")(app);
require("./routes/categoria.routes.js")(app);
require("./routes/marca.routes.js")(app);
require("./routes/sucursal.routes.js")(app);
require("./routes/tipo_documento.routes.js")(app);
require("./routes/establecimiento.routes.js")(app);
require("./routes/punto_exp.routes.js")(app);
require("./routes/iva.routes.js")(app);
require("./routes/usuario.routes.js")(app);
require("./routes/pedido.routes.js")(app);
require("./routes/caja.routes.js")(app);
require("./routes/compras.routes.js")(app)
require("./routes/proveedor.routes.js")(app)
require("./routes/producto.routes.js")(app)
require("./routes/orden_compra.routes.js")(app);
require("./routes/presupuesto.routes.js")(app);
require("./routes/nota_credito_compras.routes.js")(app);


// set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});