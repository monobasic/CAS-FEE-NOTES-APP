import NoteModel from '../src/js/modules/NoteModel';

describe("Note Model API Tests", function() {
  let dataServiceFake;
  let noteModel;

  beforeEach(function() {
    dataServiceFake = {
      getNotes: function() {
      },
      getNote: function() {},
      addNote: function() {},
      deleteNote: function() {},
      updateNote: function() {}
    };
    spyOn(dataServiceFake, 'getNotes').and.callFake(() => {
      return new Promise((resolve, reject) => {
        resolve([]);
      });
    });
    spyOn(dataServiceFake, 'getNote').and.callFake(() => {
      return new Promise((resolve, reject) => {
        resolve({});
      });
    });

    noteModel = new NoteModel(dataServiceFake);
  });

  // getNotes()

  it("On getNotes(), getNotes() of the dataService should have been called", function() {
    noteModel.getNotes().then(() => {
      expect(dataServiceFake.getNotes).toHaveBeenCalled();
    });
  });

  it("On getNotes('due', false), _sortyBy should have been called but not __filterFinished", function() {
    spyOn(noteModel, '_sortBy');
    spyOn(noteModel, '_filterFinished');
    noteModel.getNotes('due', false).then(() => {
      expect(noteModel._sortBy).toHaveBeenCalled();
      expect(noteModel._filterFinished).not.toHaveBeenCalled();
    });
  });

  it("On getNotes('due', true), _sortyBy should have been called and not __filterFinished", function() {
    spyOn(noteModel, '_sortBy');
    spyOn(noteModel, '_filterFinished');
    noteModel.getNotes('due', true).then(() => {
      expect(noteModel._sortBy).toHaveBeenCalled();
      expect(noteModel._filterFinished).toHaveBeenCalled();
    });
  });

  // getNote(id)
  it("On getNote(), getNote() of the dataService should have been called", function() {
    noteModel.getNote(12345).then(() => {
      expect(dataServiceFake.getNote).toHaveBeenCalled();
    });
  });
});
