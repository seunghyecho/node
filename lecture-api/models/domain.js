const Sequelize = require("sequelize");

class Domain extends Sequelize.Model {
  static initiate(sequelize) {
    Domain.init(
      {
        host: {
          type: Sequelize.STRING(80),
          allowNull: false,
        },
        type: {
          type: Sequelize.ENUM("free", "premium"), // 무료/유료 고객
          allowNull: false,
        },
        clientSecret: {
          type: Sequelize.UUID, // 키 한개 발급
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        paranoid: true, // 복구 가능
        modelName: "Domain",
        tableName: "domains",
      }
    );
  }

  static associate(db) {
    db.Domain.belongsTo(db.User);
  }
}

module.exports = Domain;
