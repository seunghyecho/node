const User = require("../models/user");

// follow
exports.follow = async (req, res, next) => {
  // req.user.id(내 아이디), req.params.id( 팔로잉 하려는 사람의 id)
  try {
    const user = await User.findOne({
      where: { id: req.user.id }, // 나를 먼저 찾기
    });
    if (user) {
      // db 에 데이터가 없을 경우
      await user.addFollowing(parseInt(req.params.id, 10));
      res.send("success");
    } else {
      res.status(404).send("no user");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};
