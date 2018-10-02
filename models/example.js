module.exports = function(sequelize, DataTypes) {
  var Example = sequelize.define("Example", {
    text: DataTypes.STRING,
    description: DataTypes.TEXT
  });
  return Example;
};

// module.exports = function(sequelize, DataTypes){
//   var Users = sequelize.define("Users", {
//     user_id: DataTypes.STRING,
//     user_name:DataTypes.STRING,
//     user_email:DataTypes.STRING
//   })
//   return Users;
// }
