const Sequelize = require("sequelize");

class Post extends Sequelize.Model {
  static initiate(sequelize) {
    Post.init(
      {
        content: {
          type: Sequelize.STRING(140),
          allowNull: false,
        },
        img: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        paranoid: false,
        modelName: "Post",
        tableName: "posts",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }
  static associate(db) {
    db.Post.belongsTo(db.User);
    db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" });
    // db.sequelize.models.PostHashtag 직접 접근 시 사용하기
    db.Post.belongsToMany(db.User, {
      as: "Likers", // fe 에 전달할 객체의 key
      through: "Like", // 포함시킬 db 의 table
    }); // post.addLikers, 다대다 관계 (Like 이름설정,별칭: 좋아요누른사람)
  }
}

module.exports = Post;
