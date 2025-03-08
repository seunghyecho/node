const express = require("express");
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");
const fs = require("fs"); // 파일 조작
const multer = require("multer");
const path = require("path");
const {
  afterUploadImage,
  uploadPost,
  createLike,
  deletePost,
} = require("../controllers/post");

try {
  fs.readdirSync("uploads");
} catch (error) {
  fs.mkdirSync("uploads");
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "uploads/"); // uploads 폴더에 저장하기
    },
    filename(req, file, cb) {
      console.log("file", file);
      const ext = path.extname(file.originalname); // 이미지.png
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext); // 이미지.png -> 이미지20241229.png
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 5MB
});

router.post("/img", isLoggedIn, upload.single("img"), afterUploadImage); // isLoggedIn : 서버에서 막아줘야 함

const upload2 = multer(); // upload 랑 설정이 다르기 때문에 새로 만들어 씀.
router.post("/", isLoggedIn, upload2.none(), uploadPost); //  게시글 등록 : upload2.none() 이미지를 안올릴 경우

router.post("/:postId/like", isLoggedIn, createLike);
router.delete("/:postId", isLoggedIn, deletePost);

module.exports = router;
