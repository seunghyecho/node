//  메인, 검색, 회원가입 화면 등의 페이지들을 라우트함
const express = require("express");
const router = express.Router();
const {
  renderProfile,
  renderJoin,
  renderMain,
} = require("../controllers/page");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");

router.use((req, res, next) => {
  // res.locals.user = null;
  res.locals.user = req.user; // req.user 에는 사용자 정보 가 있음
  res.locals.followerCount = 0;
  res.locals.followingCount = 0;
  res.locals.followingIdList = [];
  next(); // 미들웨어는 next 호출해야 다음으로 넘어감
});

router.get("/profile", isLoggedIn, renderProfile);
router.get("/join", isNotLoggedIn, renderJoin);
router.get("/", renderMain);

module.exports = router;
