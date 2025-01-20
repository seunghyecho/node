const jwt = require("jsonwebtoken");

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    // passport 통해서 로그인 함
    next();
  } else {
    res.status(403).send("로그인 필요");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    const message = encodeURIComponent("로그인한 상태");
    res.redirect(`/?error=${message}`); // localhost:8001?error=메세지
  }
};

exports.verifyToken = (req, res, next) => {
  try {
    res.locals.decoded = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.statue(419).json({
        code: 419,
        message: "토큰이 만료되었습니다.",
      });
    }

    return res.statue(401).json({
      code: 401,
      message: "유효하지 않은 토큰입니다.",
    });
  }
};
