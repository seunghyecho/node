const { User, Domain } = require("../models");
const { v4: uuidv4 } = require("uuid");

exports.renderLogin = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user?.id || null }, // where 에는 undefined 가 되면 안되기 때문에 null로 바꿔놓는다
      include: { model: Domain },
    });
    res.render("login", {
      user,
      domains: user?.Domains,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
exports.createDomain = async (req, res, next) => {
  try {
    await Domain.create({
      UserId: req.user.id,
      host: req.body.host,
      type: req.body.type,
      clientSecret: uuidv4(), // 랜덤한 유효 아이디를 도메인에 부여
    });
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
};
