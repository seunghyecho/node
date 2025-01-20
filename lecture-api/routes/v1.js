const express = require("express");
const { verifyToken } = require("../middlewares");
const {
  createToken,
  tokenTest,
  getMyPosts,
  getPostsByHashtag,
} = require("../controllers/v1");

const router = express.Router();

// /v1/token
router.post("/token", createToken); // req.body.clientSecret
router.get("/test", verifyToken, tokenTest);

router.get("/posts/my", verifyToken, getMyPosts); // 내게시글 가져가기
router.get("/posts/hashtag/:title", verifyToken, getPostsByHashtag); // 해시태그 검색 결과 가져가기

module.exports = router;
