const User = require("../models/user");

exports.follow = async (userId, followingId) => {
  const user = await User.findOne({
    where: { id: userId }, // 나를 먼저 찾기
  });
  if (user) {
    // db 에 데이터가 없을 경우
    await user.addFollowing(parseInt(followingId, 10));
    return "ok";
  } else {
    return "no user";
  }
};
