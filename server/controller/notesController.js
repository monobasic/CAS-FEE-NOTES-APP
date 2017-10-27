const store = require("../services/notesStore.js");

module.exports.getNotes = function(req, res) {
  console.log('controller: getNotes');
  store.getAll(function(err, notes) {
    res.format({
      'application/json': function(){
        res.json(notes);
      }
    });
  });
};

module.exports.getNote = function(req, res) {
  store.get(req.params.id, function(err, note) {
    res.format({
      'application/json': function(){
        res.json(note);
      }
    });
  });
};

module.exports.createNote = function(req, res) {
  console.log('controller: createNote');
  store.add(req.body.title, req.body.due, req.body.created, req.body.description, req.body.priority, req.body.finished, req.body.finishedOn, function(err, newNote) {
    console.log('callback from controller, note added!');
    res.format({
      'application/json': function(){
        res.json(newNote);
      }
    });
  });
};

module.exports.deleteNote =  function (req, res) {
  store.remove(req.params.id , function(err, numRemoved) {
    res.format({
      'application/json': function(){
        res.json(numRemoved);
      }
    });
  });
};

module.exports.updateNote =  function (req, res) {
  store.update(req.params.id, req.body.title, req.body.due, req.body.created, req.body.description, req.body.priority, req.body.finished, req.body.finishedOn, function(err, numUpdated) {
    res.format({
      'application/json': function(){
        res.json(numUpdated);
      }
    });
  });
};
