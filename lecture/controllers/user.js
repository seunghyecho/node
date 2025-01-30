const bcrypt = require("bcrypt");
const User = require("../models/user");
const { follow } = require("../services/user");

// follow
exports.follow = async (req, res, next) => {
  // req.user.id(내 아이디), req.params.id( 팔로잉 하려는 사람의 id)
  try {
    const result = await follow(req.user.id, req.params.id);
    if (result === "ok") {
      res.send("success");
    } else if (result === "no user") {
      res.status(404).send("no user");
    }

    // services/user 로 분리
    // const user = await User.findOne({
    //   where: { id: req.user.id }, // 나를 먼저 찾기
    // });
    // if (user) {
    //   // db 에 데이터가 없을 경우
    //   await user.addFollowing(parseInt(req.params.id, 10));
    //   res.send("success");
    // } else {
    //   res.status(404).send("no user");
    // }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// addFollowings addFollowing getFollowing setFollowing removeFollowing 등등
exports.unfollow = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id }, // 나를 먼저 찾기
    });
    if (user) {
      await user.removeFollowing(parseInt(req.params.id, 10));
      res.send("success");
    } else {
      res.status(404).send("no user");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  console.log("req.body================", req.body);
  const { nick, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { id: req.user.id } });
    const hash = await bcrypt.hash(password, 12);
    if (exUser) {
      exUser.update({
        nick,
        password: hash,
      });
      await exUser.save();

      res.status(201).send();
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};
