module.exports = function(sequelize, DataTypes) {
  var Example = sequelize.define("Example", {
    picture: DataTypes.STRING,
    email: DataTypes.TEXT,
    name: DataTypes.STRING,
    facebookID: DataTypes.BIGINT(11),
    friendsList: DataTypes.STRING(1234),
    matchList: DataTypes.STRING(1234),
    matchQueue: DataTypes.STRING(1234)
  });

  Example.sync();

  return Example; //comment

};

