const express = require("express");
const { follow, unfollow } = require("../controllers/user");
const { isLoggedIn } = require("../middlewares");
const router = express.Router();

router.post("/:id/follow", isLoggedIn, follow); // /user/${userId}/follow
router.post("/:id/unfollow", isLoggedIn, unfollow); // 팔로우 취소 /user/${userId}/unfollow

module.exports = router;
