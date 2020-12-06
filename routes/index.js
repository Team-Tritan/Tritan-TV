const { Router } = require("express");
const app = require("./app/index");
const api = require("./api/index");
var route = new Router();

route.use("/app", app);
route.use("/api", api);

route.use('/', (req, res, next) => {
    res.redirect('/app');
});


module.exports = route;
