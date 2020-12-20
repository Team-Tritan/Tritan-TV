const mongoose = require("mongoose")
const mongoString = require("./config/config.json")
const express = require("express")
const app = express();
var PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}/`);
});

function loadRoutes() {
    const routesPath = path.join(__dirname, "../tritan.tv/src/routes");
  
    fs.readdir(routesPath, (err, files) => {
      if (err) {
        throw err;
      }
  
      files.forEach((filename) => {
        const route = require(path.join(routesPath, filename));
  
        const routePath = filename === "index.js" ? "/" : `/${filename.slice(0, -3)}`;
  
        try {
          app.use(routePath, route);
          console.log(chalk.yellowBright("[LOADING ENDPOINT]"), `${routePath}`);
        } catch (error) {
          console.log(
            chalk.redBright("[WEB STARTUP ERROR] (Failed to load route)"),
            `Error occured with the route "${filename}":\n\n${error} Ignoreing continuing`
          );
        }
      });
    });
  
    return this;
  }
  
  loadRoutes();
  


mongoose.connect(mongoString)
