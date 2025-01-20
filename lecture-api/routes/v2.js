const express = require("express");
const { verifyToken, apiLimiter } = require("../middlewares");
const {
  createToken,
  tokenTest,
  getMyPosts,
  getPostsByHashtag,
} = require("../controllers/v2");

const router = express.Router();

// /v1/token
router.post("/token", apiLimiter, createToken); // req.body.clientSecret
router.get("/test", verifyToken, apiLimiter, tokenTest); // apiLimiter 에서 유저정보를 가져다 쓰기 때문에 verifyToken 이 먼저 실행되도록 함

router.get("/posts/my", verifyToken, apiLimiter, getMyPosts); // 내게시글 가져가기
router.get("/posts/hashtag/:title", verifyToken, apiLimiter, getPostsByHashtag); // 해시태그 검색 결과 가져가기

module.exports = router;
