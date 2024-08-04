const express = require("express");

const router = express.Router();

// get / 라우터
router.get("/", (req, res) => {
  res.send("hello, Express");
});

module.exports = router;
