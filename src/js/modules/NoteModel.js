import DataServiceRest from './DataServiceRest';

export default class NoteModel {

  constructor() {
    this._dataService = new DataServiceRest();
  }

  getNotes(orderBy = 'due', filterFinished = false) {
    return this._dataService.getNotes().then((notes) => {
      return filterFinished ? this._filterFinished(this._sortBy(orderBy, notes)) : this._sortBy(orderBy, notes);
    });
  }

  getNote(id) {
    return this._dataService.getNote(id).then((note) => note);
  }

  addNote(note) {
    return this._dataService.addNote(note).then((note) => note);
  }

  deleteNote(id) {
    this._dataService.deleteNote(id);
  }

  updateNote(id, data) {
    this._dataService.updateNote(id, data);
  }

  _sortBy(sort = 'due', notes) {
    return notes.sort((a, b) => a[sort] > b[sort]);
  }

  _filterFinished(notes) {
    return notes.filter(note => !note.finished);
  }

  loadTemplate(template) {
    return new Promise(function (resolve, reject) {
      let request = new XMLHttpRequest();
      request.open('GET', `./templates/${template}.hbs?${new Date().getTime()}`, true); // Time appended as parameter prevents caching
      request.onload = function() {
        if (request.status == 200) {
          resolve(request.response);
        } else {
          reject(Error(request.statusText));
        }
      };
      request.onerror = function() {
        reject(Error("Network Error"));
      };
      request.send();
    });
  }

}
