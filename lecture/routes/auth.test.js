const app = require("../app");
const request = require("supertest");
const { sequelize } = require("../models");

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

// request 비동기 인데 promise 가 아닌 애는 done 으로 인지해주어야 함.
describe("POST /join", () => {
  test("로그인 안 했으면 가입", (done) => {
    request(app)
      .post("/auth/join")
      .send({
        email: "tmdgp523@naver.com",
        nick: "tmdgp523",
        password: "1234",
      })
      .expect("Location", "/")
      .expect(302, done);
  });

  //   test("회원가입 이미 했는데 또 하는 경우", (done) => {
  //     request(app)
  //       .post("/auth/join")
  //       .send({
  //         email: "tmdgp523@naver.com",
  //         nick: "tmdgp523",
  //         password: "1234",
  //       })
  //       .expect("Location", "/join?error=exist")
  //       .expect(302, done);
  //   });
});

describe("POST /join", () => {
  const agent = request.agent(app);
  // beforeEach 등 라이프사이클 함수
  beforeEach((done) => {
    // 로그인
    agent
      .post("/auth/login")
      .send({
        email: "tmdgp523@naver.com",
        password: "1234",
      })
      .end(done);
  });

  test("로그인했으면 회원가입 진행이 안 되어야 함", (done) => {
    const message = encodeURIComponent("로그인한 상태입니다.");
    agent
      .post("/auth/join")
      .send({
        email: "tmdgp523@naver.com",
        nick: "tmdgp523",
        password: "1234",
      })
      //   .expect("Location", `/?error=${message}`)
      .expect(302, done);
  });
});

describe("POST /login", () => {
  test("로그인 수행", (done) => {
    request(app)
      .post("/auth/login")
      .send({
        email: "tmdgp523@naver.com",
        password: "1234",
      })
      .expect("Location", "/")
      .expect(302, done);
  });

  test("갸입되지 않은 회원", (done) => {
    const message = encodeURIComponent("가입되지 않은 회원입니다.");
    request(app)
      .post("/auth/login")
      .send({
        email: "tmdgp523111@naver.com",
        password: "1234",
      })
      .expect("Location", `/?loginError=${message}`)
      .expect(302, done);
  });

  test("비밀번호 틀림", (done) => {
    const message = encodeURIComponent("비밀번호가 일치하지 않습니다.");

    request(app)
      .post("/auth/login")
      .send({
        email: "tmdgp523@naver.com",
        password: "wrong",
      })
      .expect("Location", `/?loginError=${message}`)
      .expect(302, done);
  });
});

describe("GET /logout", () => {
  test("로그인 되어있지 않으면 403", (done) => {
    request(app).get("/auth/logout").expect(403, done);
  });

  const agent = request.agent(app);
  beforeEach((done) => {
    agent
      .post("/auth/login")
      .send({
        email: "tmdgp523@naver.com",
        password: "1234",
      })
      .end(done);
  });

  test("로그아웃 수행", (done) => {
    agent.get("/auth/logout").expect("Location", `/`).expect(302, done);
  });
});

// afterEach(()=>{})
afterAll(async () => {
  await sequelize.sync({ force: true });
});
