const {Router} = require('express');
const create = require('./create-room');
var route = new Router();

route.use("/create", create);

module.exports = route;