const dotenv = require("dotenv");
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session"); //개인의 저장공간을 만들어줌
const multer = require("multer");
const fs = require("fs");

dotenv.config();
const indexRouter = require("./routes");
const userRouter = require("./routes/user");
const app = express();

// 서버 시작전에 먼저 시작
try {
  fs.readdirSync("uploads"); // 찾고
} catch (error) {
  console.error("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
  fs.mkdirSync("uploads"); // 없으면 만듦
}
// upload 객체 생성
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads/");
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
// 생성된 upload 객체를 특정 한 라우터에 장착 시키는게 보통
// 한개 업로드
app.post("/upload", upload.single("image"), (req, res) => {
  console.log(req.file); //req.file
  res.send("ok");
});
// 여러개 업로드 multiple
app.post("/upload", upload.array("image"), (req, res) => {
  console.log(req.files); //req.files
  res.send("ok");
});
// image1, image2
app.post(
  "/upload",
  upload.fields([{ name: "image1", limits: 5 }, { name: "image2" }]),
  (req, res) => {
    console.log(req.files.image1); //req.files.image1
    console.log(req.files.image2); //req.files.image2
    res.send("ok");
  }
);

// 서비스에 맞게 순서 조정
app.set("port", process.env.PORT || 3000);
// app.use(morgan("combined"));
app.use(morgan("dev"));

app.use(cookieParser(process.env.COOKIE_SECRET));
// app.use(cookieParser("seunghyepassword")); //secret: "seunghyepassword" 와 동일하게 맞춰줌

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
    },
    name: "connect.sid",
  })
);

app.use("/", (req, res, next) => {
  if (req.session.id) {
    // 로그인 했다
    express.static(__dirname, "public")(req, res, next); // 미들웨어 확장하기
  } else {
    // 로그인 안했다
    next();
  }
});
// app.use("요청 경로", express.static("실제 경로"));
// app.use("/", express.static(__dirname, "public-test")); 보안에 유용
// app.use("/", express.static(__dirname, "public"));
app.use(express.json()); // bodyParser 업데이트 버전
app.use(express.urlencoded({ extended: true })); // bodyParser 업데이트 버전, true 면 qs 모듈 사용, false면 querystring 모듈 사용
app.use(multer().array());

// 공통 미들웨어
app.use(
  (req, res, next) => {
    console.log("모든 요청에 실행하고 싶어요");
    next(); // 다음 미들웨어로 넘어감
  }
  // (req, res, next) => {
  //   try {
  //     console.log("에러가 났어요");
  //   } catch (error) {
  //     next(error); // 인수가 있을 떄, 에러 미들웨어로 넘어감
  //   }
  // }
);

app.use((req, res, next) => {
  req.data = "데이터 넣기";
});

app.get("/", (req, res) => {
  req.data; // 데이터 넣기 : 미들웨어간 데이터 전달

  req.session();
  // req.session.name='seunghye'; // 세션 등록
  // req.sessionID; // 세션 아이디 확인
  // req.session.destroy(); // 세션 모두 제거

  // req.cookies; //{mycookie:'test}
  // req.signedCookies; //서명
  // req.body;

  // res.cookie("name", encodeURIComponent(name), {
  //   expires: new Date(),
  //   httpOnly: true,
  //   path: "/",
  // });
  // res.clearCookie("name", encodeURIComponent(name), {
  //   path: "/",
  // });
  // res.send("hello express"); sendFile,send,json 두번 보내면 오류 발생
  // res.json({hello:'express'});
  // res.render();
  res.sendFile(path.join(__dirname, "./index.html"));
});

app.use("/", indexRouter);
app.use("/user", userRouter);

app.post("/", (req, res) => {
  res.send("hello express!");
});

// 와일드카드 라우트
// app.get("*", (req, res) => {
//   res.send("hello wildcard!");
// });

app.use((req, res, next) => {
  res.status(404).send("Not Found"); // .status(200) 기본
});
app.use((err, req, res, next) => {
  res.status(500).send(err.message); // .status(200) 기본
});

// 에러 미들웨어
app.use((err, req, res, next) => {
  console.error(err);
  res.send("에러가 났어요");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 Express 서버 실행");
});
