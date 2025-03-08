const { isLoggedIn, isNotLoggedIn } = require("./");

// good : 설명은 자세히
describe("isLoggedIn", () => {
  // 공통
  // 가짜로 선언해줌
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(),
  };
  const next = jest.fn();

  // 로그인 성공 , isLoggedIn true
  test("로그인 되어 있으면 isLoggedIn이 next를 호출해야 함", () => {
    // jest.fn() : jest 에서 추적하는 함수형으로 변경하면 호출 횟수를 기억할수 있음
    // function(){} : 추적 못하기 때문
    // ()=> true : 콜백함수에 true 를 리턴하는 가짜 함수 추가(isAuthenticated 가 true 여야 test 함수 실행)
    const req = {
      isAuthenticated: jest.fn(() => true),
    };

    isLoggedIn(req, res, next);
    expect(next).toBeCalledTimes(1); // next 가 한번 호출했는지
  });

  // 로그인 실패 , isLoggedIn false
  test("로그인 되어 있지 않으면 isLoggedIn이 에러를 응답해야 함", () => {
    const req = {
      isAuthenticated: jest.fn(() => false),
    };
    // const next = jest.fn(); // 호출 안함

    isLoggedIn(req, res, next);
    expect(res.status).toBeCalledWith(403);
    expect(res.send).toBeCalledWith("로그인 필요"); // expect 가 전부 통과해야 함
  });
});

describe("isNotLoggedIn", () => {
  // 공통
  const res = {
    redirect: jest.fn(),
  };
  const next = jest.fn();

  // 로그인 성공 , isLoggedIn false
  test("로그인 되어 있으면 isNotLoggedIn이 에러를 응답해야 함", () => {
    const req = {
      isAuthenticated: jest.fn(() => true),
    };

    isNotLoggedIn(req, res, next);
    const message = encodeURIComponent("로그인한 상태");
    expect(res.redirect).toBeCalledWith(`/?error=${message}`);
  });

  // 로그인 실패 , isNotLoggedIn이 true
  test("로그인 되어 있지 않으면 isNotLoggedIn이 next를 호출해야 함", () => {
    const req = {
      isAuthenticated: jest.fn(() => false),
    };

    isNotLoggedIn(req, res, next);
    expect(next).toBeCalledTimes(1);
  });
});
