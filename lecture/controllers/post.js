const Post = require("../models/post");
const HashTag = require("../models/hashtag");

// afterUploadImage, uploadPost
exports.afterUploadImage = (req, res) => {
  // multer 를 통해서 업로드하면
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` }); // FE 로 보내줌
};
exports.uploadPost = async (req, res, next) => {
  // req.body.content, req.body.url
  try {
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      UserId: req.user.id, // 1. UserId
    });
    // 2. UserId : await post.addUser(req.user.id);

    // 해시 태그를 가리키는 정규 표현식 : /#[^\s#]*/g) (공백 또는 #이 없는 나머지)
    const hashtags = req.body.content.match(/#[^\s#]*/g);
    if (hashtags) {
      // 기존 해시 태그 를 가져오거나 생성함.
      // Promise.all : ['#해시태그', '#해시태그','#해시태그']
      const result = await Promise.all(
        hashtags.map((tag) => {
          return HashTag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          });
        })
      );
      // console.log("result", result);
      await post.addHashtags(result.map((r) => r[0]));
    }
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.createLike = async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });

    if (!post) {
      return res.status(403).send("게시글이 존재하지 않습니다.");
    }

    const hasLiked = await post.hasLiker(req.user.id);
    if (hasLiked) {
      await post.removeLikers(req.user.id);
      return res.status(200).json({
        message: "좋아요가 취소되었습니다.",
        postId: post.id,
        userId: req.user.id,
      });
    } else {
      await post.addLiker(req.user.id);
      // res.status(200).json({ postId: post.id, userId: req.user.id });
      return res.status(200).json({
        message: "좋아요가 추가되었습니다.",
        postId: post.id,
        userId: req.user.id,
      });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};
