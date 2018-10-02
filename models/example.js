module.exports = function(sequelize, DataTypes) {
  var Example = sequelize.define("Example", {
    text: DataTypes.STRING,
    description: DataTypes.TEXT,
    name: DataTypes.STRING,
    facebookID: DataTypes.INTEGER,
  });

  Example.sync();
  
  return Example;



};

