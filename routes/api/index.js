const {Router} = require('express');
const v1 = require('./v1/index');
var route = new Router();

route.use('/v1', v1)
module.exports = route;