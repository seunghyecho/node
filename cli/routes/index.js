// 파일 생성 명령어 : node template express-router index ./routes
const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  try {
    res.send("ok");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
