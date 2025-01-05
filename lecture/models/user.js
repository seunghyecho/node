const Sequelize = require("sequelize");

class User extends Sequelize.Model {
  static initiate(sequelize) {
    User.init(
      {
        email: {
          type: Sequelize.STRING(40),
          allowNull: true,
          unique: true,
        },
        nick: {
          type: Sequelize.STRING(15),
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        provider: {
          type: Sequelize.ENUM("local", "kakao"),
          allowNull: false,
          defaultValue: "local",
        },
        snsId: {
          type: Sequelize.STRING(30),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true, // createdAt, updateAt
        underscored: false,
        modelName: "User", // 자바스크립트에서 씀
        tableName: "user", // db에서 씀
        paranoid: true, // deletedAt 유저 삭제일 soft delete
        charset: "utf8", // db에 어떤 문자로 저장할지, utf8mb4(이모티콘 사용시)
        collate: "utf8_general_ci", // 저장된 문자를 어떤 방식으로 정렬할지, utf8mb4_general_ci(이모티콘 사용시)
      }
    );
  }
  static associate(db) {
    db.User.hasMany(db.Post);
    db.User.belongsToMany(db.User, {
      foreignKey: "followingId",
      as: "Followers",
      through: "Follow",
    }); // 팔로워
    db.User.belongsToMany(db.User, {
      foreignKey: "followerId",
      as: "Followings",
      through: "Follow",
    }); // 팔로잉
    db.User.belongsToMany(db.Post, { as: "Liked", through: "Like" });
  }
}

module.exports = User;

// 테이블 설정 코드
// class User extends Sequelize.Model {
//     static initiate(sequelize) {}
//     static associate(db) {}
//   }
