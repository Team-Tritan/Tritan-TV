const {Router} = require('express');
const rooms = require('../../../models/room-data');
var route = new Router();

route.post('/', async (req, res, next) => {

    const rand = Math.random().toString().substr(2, 8);

    try{ 
        await new rooms({
            id: rand,
            public: req.body.public ? req.body.public : false,
            queue: [],
            name: req.body.name ? req.body.name : rand
        }).save();

        let room = await rooms.findOne({id: rand});

        res.send(JSON.stringify(room));

    } catch (e) {
        res.send(JSON.stringify({ error: e }));
    }
});

module.exports = route;