const Sequelize = require("sequelize");
class Auction extends Sequelize.Model {
  static initiate(sequelize) {
    Auction.init(
      {
        bid: {
          type: Sequelize.INTEGER, // 가격
          allowNull: false,
          defaultValue: 0,
        },
        msg: {
          type: Sequelize.STRING(100), // 입찰 시 간단한 메세지 전송
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        paranoid: true,
        modelName: "Auction",
        tableName: "auctions",
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.Auction.belongsTo(db.User); // 사용자가 입찰
    db.Auction.belongsTo(db.Good); // 한 상품에 대한 입찰
  }
}
module.exports = Auction;
