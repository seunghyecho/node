const Post = require("../models/post");
const User = require("../models/user");

// spring pattern
exports.renderProfile = (req, res, next) => {
  // 서비스를 호출
  res.render("profile", { title: "내 정보 - 노드버드" });
};
exports.renderJoin = (req, res, next) => {
  res.render("join", { title: "회원 가입 - 노드버드" });
};
exports.renderMain = async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      include: {
        model: User,
        attributes: ["id", "nick"],
      },
      order: [["createdAt", "DESC"]], // 정렬
    });
    res.render("main", { title: "노드버드", twits: posts });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// 계층적 호출 : 라우터 -> 컨트롤러(요청, 응답 앎) -> 서비스(요청, 응답 모름)
