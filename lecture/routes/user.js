const express = require("express");
const { follow } = require("../controllers/user");
const { isLoggedIn } = require("../middlewares");
const router = express.Router();

router.post("/:id/follow", isLoggedIn, follow);
// TODO 팔로우 취소

module.exports = router;
