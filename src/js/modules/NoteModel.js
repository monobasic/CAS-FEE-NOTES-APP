import DataServiceLocalStorage from './DataServiceLocalStorage';

export default class NoteModel {

  constructor() {
    this._dataService = new DataServiceLocalStorage();
  }

  getNotes(orderBy = 'due', filterFinished = false) {
    return filterFinished ? this._filterFinished(this._sortBy(orderBy, this._dataService.getNotes())) : this._sortBy(orderBy, this._dataService.getNotes());
  }

  getNote(id) {
    return this._dataService.getNote(id);
  }

  addNote(note) {
    this._dataService.addNote(note);
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
