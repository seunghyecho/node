const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const User = require("../models/user");
const bcrypt = require("bcrypt");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email", // req.body.email
        passwordField: "password", //req.body.password
        passReqToCallback: false,
      },
      async (email, password, done) => {
        // done(서버실패, 성공유저, 로직실패)
        try {
          const exUser = await User.findOne({ where: { email } }); // 기존 유저 체크
          if (exUser) {
            const result = await bcrypt.compare(password, exUser.password); // 기존 비밀번호 체크
            if (result) {
              done(null, exUser); // 성공유저
            } else {
              done(null, false, { message: "비밀번호가 일치하지 않습니다." }); // 로직실패
            }
          } else {
            done(null, false, { message: "가입되지 않은 회원입니다." }); // 로직실패
          }
        } catch (error) {
          console.error(error); // 서버실패
        }
      }
    )
  );
};
