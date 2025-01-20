const express = require("express");
const passport = require("passport");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");
const { join, login, logout } = require("../controllers/auth");
const router = express.Router();

// POST /auth/join
router.post("/join", isNotLoggedIn, join);
// POST /auth/login
router.post("/login", isNotLoggedIn, login);
// GET /auth/logout
router.get("/logout", isLoggedIn, logout);

// router.post(
//   "/auth/login",
//   passport.authenticate("local", () => {
//     req.login();
//   })
// );

// 카카오톡 로그인 구조
// /auth/kakao -> 카카오톡 로그인 화면 -> /auth/kakao/callback 로 리다이렉트되는 구조
// /auth/kakao
router.get("/kakao", passport.authenticate("kakao")); // 기본 꼴, 카카오로그인 버튼 클릭시 요청됨, 카카오톡 로그인 화면으로 리다이렉트
// /auth/kakao/callback
router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/?loginError=카카오로그인 실패", // passport-kakao 공식문서 참고
  }),
  (req, res) => {
    res.redirect("/");
  }
);

module.exports = router;
