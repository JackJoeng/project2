var db = require("../models");

module.exports = function (app) {
  // Get all examples
  app.get("/api/examples", function (req, res) {
    db.Example.findAll({}).then(function (dbExamples) {
      res.json(dbExamples);
    });
  });

  // Create a new example
  app.post("/api/examples", function(req, res) {
    db.Example.create(req.body).then(function(dbExample) {
      res.json(dbExample);
    });
  });



  app.get("/api/examples/:id", function (req, res) {
    db.Example.findAll({
      where: {
        id: req.params.id
      }
    }).then(function (dbExamples) {
      res.json(dbExamples);
    });
  });



  // Delete an example by id
  app.delete("/api/examples/:id", function (req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function (dbExample) {
      res.json(dbExample);
    });
  });

  app.put("/api/examples/:id", function (req, res) {
    // Update takes in an object describing the properties we want to update, and
    // we use where to describe which objects we want to update
    const reqBody = req.body;
    console.log('reqbody ', reqBody);
    db.Example.update(req.body, {
      where: {
        id: req.params.id
      }
    }).then(function (dbExample) {
      res.json(dbExample);
    });
  });

};




