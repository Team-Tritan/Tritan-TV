const {Router} = require('express');
var route = new Router();

route.post('/', async (req, res, next) => {

    const rand = Math.random().toString().substr(2, 8);

    try{
        req.app.get("rooms").set(rand, { public: req.body.public ? req.body.public : false, queue: [], id: rand, name: req.body.name });

        let room = req.app.get("rooms").get(rand);

        res.send(JSON.stringify(room));
    } catch (e) {
        res.send(JSON.stringify({ error: e }));
    }
});

module.exports = route;