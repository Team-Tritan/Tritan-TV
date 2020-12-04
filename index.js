const express = require("express");
const app = express();
const chalk = require("chalk");
const path = require("path");
var http = require("http").Server(app);
var io = require("socket.io")(http);
const config = require("./config/config.json");
const routing = require("./routes/index");
var rooms = new Map();

app.set("rooms", rooms);
app.use(express.json());
app.use("/", express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use("/", routing);

app.listen(config.port, () => {
  console.log(
    chalk.greenBright(`Tritan Radio listening on port ${config.port}!`)
  );
});
