const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const multer = require("multer");
const app = express();

// 서비스에 맞게 순서 조정
app.set("port", process.env.PORT || 3000);
// app.use(morgan("combined"));
app.use(morgan("dev"));
// app.use("요청 경로", express.static("실제 경로"));
// app.use("/", express.static(__dirname, "public-test")); 보안에 유용
// app.use("/", express.static(__dirname, "public"));
app.use(cookieParser());
app.use(express.json()); // bodyParser 업데이트 버전
app.use(express.urlencoded({ extended: true })); // bodyParser 업데이트 버전, true 면 qs 모듈 사용, false면 querystring 모듈 사용
app.use(session());
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

app.get("/", (req, res) => {
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

app.post("/", (req, res) => {
  res.send("hello express!");
});

// 와일드카드 라우트
app.get("*", (req, res) => {
  res.send("hello wildcard!");
});

app.use((req, res, next) => {
  res.send("404 처리"); // .status(200) 기본
});

// 에러 미들웨어
app.use((err, req, res, next) => {
  console.error(err);
  res.send("에러가 났어요");
});

app.listen(app.get("port"), () => {
  console.log("Express 서버 실행");
});
