const express = require("express")
const app = express()
const config = require("./config/config.json")
app.set("view engine", "ejs")


app.get('/', (req, res) => {
    res.render('index')
  });
  
  app.listen(config.port, () => {
    console.log(`server started on port ${config.port}!`);
  });