const Sequelize = require("sequelize");

class Good extends Sequelize.Model {
  static initiate(sequelize) {
    Good.init(
      {
        name: {
          type: Sequelize.STRING(40),
          allowNull: false,
        },
        img: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
        price: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        timestamps: true,
        paranoid: true,
        modelName: "Good",
        tableName: "goods",
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.Good.belongsTo(db.User, { as: "Owner" }); // 물건의 주인
    db.Good.belongsTo(db.User, { as: "Sold" }); // 물건을 낙찰받은 사람
    db.Good.hasMany(db.Auction); // 물건에 대해서 입찰이 여러번 있을 수 있음
  }
}

module.exports = Good;
