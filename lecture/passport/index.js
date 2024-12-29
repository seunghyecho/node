const passport = require("passport");
const local = require("./localStrategy");
const kakao = require("./kakaoStrategy");
const User = require("../models/user");

module.exports = () => {
  passport.serializeUser((user, done) => {
    // user === exUser
    done(null, user.id); // user id만 추출, user 전체를 저장시 메모리 터질수 있음.
  });
  // 세션 {123123123: 1} 은 객체 형식, { 세션쿠키: 유저아이디 } -> 메모리 저장됨.

  passport.deserializeUser((id, done) => {
    // id : 1 의 사용자를 조회함.
    User.findOne({ where: { id } })
      .then((user) => done(null, user)) // req.user
      .catch((err) => done(err));
  });

  local();
  kakao();
};
