module.exports = function(sequelize, DataTypes) {
  var Example = sequelize.define("Example", {
    picture: DataTypes.STRING,
    email: DataTypes.TEXT,
    name: DataTypes.STRING,
    facebookID: DataTypes.BIGINT(11),
  });

  Example.sync();

  return Example; //comment

};

