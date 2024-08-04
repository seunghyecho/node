const express = require("express");

const router = express.Router();

// GET /user/ 라우터
router.get("/", (req, res) => {
  res.send("hello, User");
});

module.exports = router;
