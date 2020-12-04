const {Router} = require('express');
var route = new Router();

route.use('/:id', (req, res) => {

    if(!req.app.get("rooms").has(req.params.id)){
        res.status(404).end();
    }

    let room = req.app.get("rooms").get(req.params.id);

    let data =  {
        room: room
    }

    res.render("room", data);


});


route.use('/', (req, res) => {
    res.render('index')
});



module.exports = route;