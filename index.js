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


// set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});