const Hashtag = require("../models/hashtag");
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

exports.renderHashtag = async (req, res, next) => {
  const query = req.query.hashtag;
  if (!query) {
    return res.redirect("/");
  }
  try {
    const hashtag = await Hashtag.findOne({
      where: { title: query },
    });
    let posts = [];
    if (hashtag) {
      posts = await hashtag.getPosts({
        include: [{ model: User, attributes: ["id", "nick"] }],
        order: [["createdAt", "DESC"]], // 최신
      });
    }
    // 게시글들 찾아서 화면에 렌더링 해줘.
    res.render("main", {
      title: `${query} | Nodebird`,
      twits: posts,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
