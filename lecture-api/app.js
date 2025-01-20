const express = require("express"); // app.js
const cookieParser = require("cookie-parser"); // 쿠키
const morgan = require("morgan"); // 요청과 응답에 대한 로깅을 위한
const path = require("path"); // 노드 내장 모듈
const session = require("express-session"); // 로그인의 세션을 사용하기 위한
const nunjucks = require("nunjucks"); // 노드에서 사용하는 템플릿 엔진
const dotenv = require("dotenv"); // 설정 파일
const passport = require("passport"); // passport-local : email 로그인, passport-kakao : kakao 로그인

const { sequelize } = require("./models");

// process.env.COOKIE_SECRET 없음
dotenv.config(); // process.env 안에 들어감, 최대한 위로 올라가 있어야 함
// process.env.COOKIE_SECRET 있음
const authRouter = require("./routes/auth");
const indexRouter = require("./routes");
const passportConfig = require("./passport");

const app = express();
passportConfig();
app.set("port", process.env.PORT || 8001);
app.set("view engine", "html"); // 페이지들 확장자는 html(넌적스)
nunjucks.configure("views", {
  // 사용방법 공식문서 참고
  express: app,
  watch: true,
});

sequelize
  .sync({ force: false }) //개발시
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public"))); // public 폴더(만 허용)를 static 폴더로 만듦
app.use(express.json()); // body parser, req.body를 ajax json 요청으로부터
app.use(express.urlencoded({ extended: false })); // body parser, req.body form 으로부터
app.use(cookieParser(process.env.COOKIE_SECRET)); // cookie parser
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);
app.use(passport.initialize()); // passport 미들웨어는 반드시 세션 미들웨어 아래에 넣기, req.user, req.login, req.isAuthenticate, req.logout 가 여기서 생김
app.use(passport.session()); // passport 미들웨어는 반드시 세션 미들웨어 아래에 넣기, connect.sid 라는 이름으로 세션 쿠키가 브라우저로 전송
// 브라우저 connect.sid=123123123123 가 서버로 오면 쿠키파서로 감

app.use("/auth", authRouter);
app.use("/", indexRouter);

app.use((req, res, next) => {
  //404 not found
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error); // 미들웨어는 next 호출해야 다음으로 넘어감
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {}; // 에러 로그를 서비스에 넘김
  res.status(err.status || 500);
  res.render("error");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
