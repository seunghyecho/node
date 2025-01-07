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

  // deserializeUser : 주로 passport를 사용할 때 인증된 사용자의 세션을 복원하는 과정에서 사용. 캐싱을 구현하면 데이터베이스 호출을 줄이고 성능을 향상

  // passport.deserializeUser((id, done) => {
  //   // id : 1 의 사용자를 조회함.
  //   User.findOne({
  //     where: { id },
  //     include: [
  //       {
  //         model: User,
  //         attributes: ["id", "nick"],
  //         as: "Followers",
  //       }, // 팔로잉
  //       {
  //         model: User,
  //         attributes: ["id", "nick"],
  //         as: "Followings",
  //       }, // 팔로워
  //     ],
  //   })
  //     .then((user) => {
  //       done(null, user);
  //     }) // req.user, req.session
  //     .catch((err) => done(err));
  // });

  // userCache 캐싱 구현 (캐싱 : 데이터임시저장)
  const userCache = new Map();
  passport.deserializeUser(async (id, done) => {
    try {
      // 1. Map에서 사용자 데이터 조회
      if (userCache.has(id)) {
        // console.log("user 222222222", userCache.get(id));
        return done(null, userCache.get(id)); // 캐시된 사용자 반환
      }

      // 2. 데이터베이스에서 사용자 조회
      const user = await User.findOne({
        where: { id },
        include: [
          {
            model: User,
            attributes: ["id", "nick"],
            as: "Followers",
          }, // 팔로잉
          {
            model: User,
            attributes: ["id", "nick"],
            as: "Followings",
          }, // 팔로워
        ],
      });
      if (!user) {
        return done(null, false);
      }

      // 3. Map에 사용자 데이터를 캐싱
      userCache.set(id, user);
      // console.log("user 111111111", user);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  local();
  kakao();
};
