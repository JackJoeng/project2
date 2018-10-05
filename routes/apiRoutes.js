var db = require("../models");

module.exports = function(app) {
  // Get all examples
  app.get("/api/examples", function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.json(dbExamples);
    });
  });


  app.get("/api/users", function(req, res) {
    db.Users.findAll({}).then(function(dbExamples) {
      res.json(dbUsers);
    });
  });

  app.post("/api/users", function(req, res) {
    db.Users.create({}).then(function(dbExamples) {
      res.json(dbUsers);
    });
  });

  // Create a new example
  app.post("/api/examples", function(req, res) {
    db.Example.create(req.body).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
      res.json(dbExample);
    });
  });
};
