const express = require("express");
const { follow, unfollow, updateProfile } = require("../controllers/user");
const { isLoggedIn } = require("../middlewares");
const router = express.Router();

router.post("/:id/follow", isLoggedIn, follow); // /user/${userId}/follow
router.post("/:id/unfollow", isLoggedIn, unfollow); // 팔로우 취소 /user/${userId}/unfollow
router.put("/:id/profile", isLoggedIn, updateProfile);

module.exports = router;
