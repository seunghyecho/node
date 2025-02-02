const express = require("express");
const {
  renderMain,
  renderRoom,
  createRoom,
  enterRoom,
  removeRoom,
} = require("../controllers");

const router = express.Router();

router.get("/", renderMain);
router.get("/room", renderRoom);
router.post("/room", createRoom);
router.get("/room/:id", enterRoom);
router.delete("/room/:id", removeRoom);

module.exports = router;

// router.get("/", renderMain);
// router.get("/", (req, res) => {
//   res.render("index");
// });
