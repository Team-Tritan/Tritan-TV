const express = require("express")
const app = express()
var port = "3000"
app.set("view engine", "ejs")


app.get('/', (req, res) => {
    res.render('index')
  });
  
  app.listen(port, () => {
    console.log(`server started on port ${port}!`);
  });