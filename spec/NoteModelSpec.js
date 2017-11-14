import NoteModel from '../src/js/modules/NoteModel';

describe("Note Model API Tests", function() {
  let dataServiceFake;
  let noteModel;

  beforeEach(function() {
    dataServiceFake = {
      getNotes: () => {},
      getNote: () => {},
      addNote: () => {},
      deleteNote: () => {},
      updateNote: () => {}
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
    spyOn(dataServiceFake, 'addNote').and.callFake(() => {
      return new Promise((resolve, reject) => {
        resolve({});
      });
    });
    spyOn(dataServiceFake, 'deleteNote').and.callFake(() => {
      return new Promise((resolve, reject) => {
        resolve({});
      });
    });
    spyOn(dataServiceFake, 'updateNote').and.callFake(() => {
      return new Promise((resolve, reject) => {
        resolve({});
      });
    });

    noteModel = new NoteModel(dataServiceFake);
  });

  it("On getNotes(), getNotes() of the dataService should have been called", function() {
    noteModel.getNotes().then(() => {
      expect(dataServiceFake.getNotes).toHaveBeenCalled();
    });
  });
  it("On getNotes('due', false, 'asc'), _sortyBy should have been called but not _filterFinished", function() {
    spyOn(noteModel, '_sortBy');
    spyOn(noteModel, '_filterFinished');
    noteModel.getNotes('due', false, 'asc').then(() => {
      expect(noteModel._sortBy).toHaveBeenCalled();
      expect(noteModel._filterFinished).not.toHaveBeenCalled();
    });
  });
  it("On getNotes('due', true, 'desc'), _sortyBy should have been called and _filterFinished", function() {
    spyOn(noteModel, '_sortBy');
    spyOn(noteModel, '_filterFinished');
    noteModel.getNotes('due', true, 'desc').then(() => {
      expect(noteModel._sortBy).toHaveBeenCalled();
      expect(noteModel._filterFinished).toHaveBeenCalled();
    });
  });


  it("On getNote(), getNote() of the dataService should have been called", function() {
    noteModel.getNote(12345).then(() => {
      expect(dataServiceFake.getNote).toHaveBeenCalled();
    });
  });

  it("On addNote(), addNote() of the dataService should have been called", function() {
    noteModel.addNote({}).then(() => {
      expect(dataServiceFake.addNote).toHaveBeenCalled();
    });
  });

  it("On deleteNote(), deleteNote() of the dataService should have been called", function() {
    noteModel.deleteNote(12345).then(() => {
      expect(dataServiceFake.deleteNote).toHaveBeenCalled();
    });
  });

  it("On updateNote(), updateNote() of the dataService should have been called", function() {
    noteModel.updateNote(12345, {}).then(() => {
      expect(dataServiceFake.updateNote).toHaveBeenCalled();
    });
  });

  it("On _sortBy('due', notes), returned notes should be sorted by due date asc", function() {
    let notes = [{due: '2017-01-13'}, {due: '2015-02-29'}];
    let notesSorted = [{due: '2015-02-29'}, {due: '2017-01-13'}];
    expect(noteModel._sortBy('due', notes)).toEqual(notesSorted);
  });

  it("On _sortBy('due', notes, 'desc'), returned notes should be sorted by due date asc", function() {
    let notes = [{due: '2017-01-13'}, {due: '2015-02-29'}];
    let notesSorted = [{due: '2017-01-13'}, {due: '2015-02-29'}];
    expect(noteModel._sortBy('due', notes, 'desc')).toEqual(notesSorted);
  });

  it("On _filterFinished(notes), returned notes should be filtered", function() {
    let notes = [{finished: true}, {finished: true}, {finished: false}];
    let notesFiltered = [{finished: false}];
    expect(noteModel._filterFinished(notes)).toEqual(notesFiltered);
  });
});
