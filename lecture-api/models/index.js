const Sequelize = require("sequelize");
const fs = require("fs");
const path = require("path");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env]; // 설정 불러오기

const db = {}; // 객체로 하나로 묶어서 사용하기

const sequelize = new Sequelize( // sequelize 연결하기
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;

// 터미널 명령 : path.basename(process.cwd())
const basename = path.basename(__filename); // index.js
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file));
    console.log(file, model.name);
    db[model.name] = model;
    model.initiate(sequelize);
  });

Object.keys(db).forEach((modelName) => {
  console.log(modelName, db);
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;

// -----------------------------------------------------------
// const Sequelize = require("sequelize");
// const User = require("./user");
// const Post = require("./post");
// const Hashtag = require("./hashtag");
// const env = process.env.NODE_ENV || "development";
// const config = require("../config/config")[env]; // 설정 불러오기

// const db = {}; // 객체로 하나로 묶어서 사용하기

// const sequelize = new Sequelize( // sequelize 연결하기
//   config.database,
//   config.username,
//   config.password,
//   config
// );

// db.sequelize = sequelize;

// db.User = User;
// db.Post = Post;
// db.Hashtag = Hashtag;
// User.initiate(sequelize);
// Post.initiate(sequelize);
// Hashtag.initiate(sequelize);
// User.associate(db);
// Post.associate(db);
// Hashtag.associate(db);

// module.exports = db;

// --------------------------------초기 설정된 코드 ------------------------
// 'use strict';

// const fs = require('fs');
// const path = require('path');
// const Sequelize = require('sequelize');
// const process = require('process');
// const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config.json')[env];
// const db = {};

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (
//       file.indexOf('.') !== 0 &&
//       file !== basename &&
//       file.slice(-3) === '.js' &&
//       file.indexOf('.test.js') === -1
//     );
//   })
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//     db[model.name] = model;
//   });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;
