const { Router } = require("express");
const rooms = require("../../../models/room-data");
var route = new Router();

route.post("/", async (req, res, next) => {
  const rand = Math.random().toString().substr(2, 8);

  try {
    await new rooms({
      id: rand,
      public: req.body.privacy ? req.body.privacy : false,
      queue: [],
      name: req.body.name ? req.body.name : rand,
      userLimit: req.body.userLimit ? req.body.userLimit : 90,
      password: req.body.password ? req.body.password : "",
    }).save();

    let room = await rooms.findOne({ id: rand });

    res.send(JSON.stringify(room));
  } catch (e) {
    res.send(JSON.stringify({ error: e }));
  }
});

module.exports = route;
