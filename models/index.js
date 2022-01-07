'use strict';
const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], {config, dialect: 'postgres', logging: false});
} else {
  // sequelize = new Sequelize(config.database, config.username, config.password, {config, dialect: 'postgres', logging: false});
//  console.log(process.env.DB_URI);
  sequelize = new Sequelize(process.env.DB_URI, { logging: false});
}


sequelize.authenticate()
.then(()=>{
  console.log('Connection to database establised');
}) 
.catch(err => {
  console.error(`Unable to connect to database:`, err);
});

// sequelize.sync({ alter: true }).then(() => {
//   console.log("DB refreshed");
//   // return sequelize.drop();
// });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

fs
.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });
  
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.user.hasMany(db.twit, {
  as: 'twits',
  foreignKey: 'userId'
});

db.user.hasMany(db.comment, {
  as: 'usercomments',
  foreignKey: 'userId'
});

db.user.hasMany(db.like, {
  as: 'userlikes',
  foreignKey: 'userId'
});

db.user.hasMany(db.likecomment, {
  as: 'userlikecomments',
  foreignKey: 'userId'
});

db.twit.belongsTo(db.user, {
  as: 'twits',
  foreignKey: 'userId'
});

db.comment.belongsTo(db.user, {
  as: 'usercomments',
  foreignKey: 'userId'
});

db.like.belongsTo(db.user, {
  as: 'userlikes',
  foreignKey: 'userId'
});

db.likecomment.belongsTo(db.user, {
  as: 'userlikecomments',
  foreignKey: 'userId'
});

db.twit.hasMany(db.like, {
  as: 'likes',
  foreignKey: 'twitId'
});

db.comment.hasMany(db.likecomment, {
  as: 'likecomments',
  foreignKey: 'commentId'
});

db.twit.hasMany(db.comment, {
  as: 'comments',
  foreignKey: 'twitId'
});

db.like.belongsTo(db.twit, {
  as: 'likes',
  foreignKey: 'twitId'
});

db.likecomment.belongsTo(db.comment, {
  as: 'likecomments',
  foreignKey: 'commentId'
});

db.comment.belongsTo(db.twit, {
  as: 'comments',
  foreignKey: 'twitId'
});

// relations for followers table
db.user.hasMany(db.follower, {
  as: 'followers',
  // as: 'following',
  foreignKey: 'userId'
});

db.user.hasMany(db.follower, {
  as: 'following',
  // as: 'followers',
  foreignKey: 'followerId'
});

db.follower.belongsTo(db.user, {
  as: 'followers',
  // as: 'following',
  foreignKey: 'userId'
});

db.follower.belongsTo(db.user, {
  as: 'following',
  // as: 'following',
  foreignKey: 'followerId'
});

module.exports = db;
