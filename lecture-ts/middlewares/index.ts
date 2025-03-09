import { RequestHandler } from "express";
const isLoggedIn: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    // passport 통해서 로그인 함
    next();
  } else {
    res.status(403).send("로그인 필요");
  }
};
const isNotLoggedIn: RequestHandler = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    const message = encodeURIComponent("로그인한 상태");
    res.redirect(`/?error=${message}`); // localhost:8001?error=메세지
  }
};

export { isLoggedIn, isNotLoggedIn };
