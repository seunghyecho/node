const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/user");

exports.join = async (req, res, next) => {
  const { nick, email, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.redirect("/join?error=exist");
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nick,
      password: hash,
    });
    return res.redirect("/"); // 302
  } catch (error) {
    console.error(error);
    next(error);
  }
};
exports.login = (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    // 최종적으로 done(서버실패, 성공유저, 로직실패) 실행되는 부분
    if (authError) {
      // 서버실패
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      // 로직실패
      return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(user, (loginError) => {
      // 로그인 성공
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect("/");
    });
  })(req, res, next); // 미들웨어 확장 패턴, next 를 쓰기 위해
};

// app.use(passport.authenticate("kakao"));
// app.use((req, res, next) => passport.authenticate("kakao")(req, res, next));

exports.logout = (req, res, next) => {
  // 세션쿠키 {123123123 : 1} 를  { } 로 없애버림. 브라우저 connect.sid가 남아있어도
  req.logout(() => {
    res.redirect("/");
  });
};
