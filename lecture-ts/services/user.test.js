jest.mock("../models/user");
const User = require("../models/user");
const { follow } = require("./user");

// req, res, next 가 없어짐, 핵심 로직만 테스트

describe("follow", () => {
  test("사용자를 찾아 팔로잉을 추가하고 ok를 반환함", async () => {
    User.findOne.mockReturnValue({
      addFollowing(id) {
        return Promise.resolve(true);
      },
    });
    const result = await follow(1, 2); // userId, followingId
    expect(result).toEqual("ok");
  });

  test("사용자를 못 찾으면 no user를 반환함", async () => {
    User.findOne.mockReturnValue(Promise.resolve(null));
    const result = await follow(1, 2); // userId, followingId
    expect(result).toEqual("no user");
  });

  test("DB 에서 에러가 발생하면 next(error)를 호출함", async () => {
    const message = "DB 에러";
    User.findOne.mockReturnValue(Promise.reject(message));
    try {
      await follow(1, 2); // userId, followingId
    } catch (error) {
      expect(error).toEqual(message);
    }
  });
});
