const express = require("express");
const {
  verifyToken,
  apiLimiter,
  corsWhenDomainMatches,
} = require("../middlewares");
const {
  createToken,
  tokenTest,
  getMyPosts,
  getPostsByHashtag,
} = require("../controllers/v2");
const cors = require("cors");

const router = express.Router();

// 1. cors 사용 x
// router.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:4000");
//   res.setHeader("Access-Control-Allow-Headers", "content-type");
//   next();
// });

// 2. cors 사용 o
// router.use(
//   cors({
//     origin: "http://localhost:4000",
//     credentials: true,
//   })
// );

// 3. 사용자마다 origin 이 다를 때 미들웨어 확장패턴으로 사용
router.use(corsWhenDomainMatches);

// /v1/token
router.post("/token", apiLimiter, createToken); // req.body.clientSecret
router.get("/test", verifyToken, apiLimiter, tokenTest); // apiLimiter 에서 유저정보를 가져다 쓰기 때문에 verifyToken 이 먼저 실행되도록 함

router.get("/posts/my", verifyToken, apiLimiter, getMyPosts); // 내게시글 가져가기
router.get("/posts/hashtag/:title", verifyToken, apiLimiter, getPostsByHashtag); // 해시태그 검색 결과 가져가기

module.exports = router;
