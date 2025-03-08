// require 된 모델 커버리지 100 만들기 위한 test.js
const Sequelize = require("sequelize");
const User = require("./user");
const config = require("../config/config.json")["test"];
// sequelize 연결 설정 불러오기
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

describe("User 모델", () => {
  test("static initiate 메서드 호출", () => {
    expect(User.initiate(sequelize)).toBe(undefined);
  });

  test("static associate 메서드 호출", () => {
    const db = {
      User: {
        hasMany: jest.fn(),
        belongsToMany: jest.fn(),
      },
      Post: {},
    };
    User.associate(db);
    expect(db.User.hasMany).toHaveBeenCalledWith(db.Post);
    // expect(db.User.belongsToMany).toHaveBeenCalledTimes(2);
    expect(db.User.belongsToMany).toHaveBeenCalledTimes(3);
  });
});
