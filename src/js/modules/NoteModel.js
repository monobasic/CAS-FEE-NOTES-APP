import DataServiceLocalStorage from './DataServiceLocalStorage';

export default class NoteModel {

  constructor() {
    this._dataService = new DataServiceLocalStorage();
  }

  getNotes() {
    return this._dataService.getNotes();
  }

  getNote(index) {
    return this._dataService.getNote(index);
  }

  addNote(note) {
    this._dataService.addNote(note);
  }

  deleteNote(index) {
    this._dataService.deleteNote(index);
  }

  updateNote(note) {
    this._dataService.updateNote(note);
  }



  sortByDateDue(notes) {
    return notes.sort((a, b) => a.due > b.due);
  }

  sortByDateCreated(notes) {
    return notes.sort((a, b) => a.created > b.created);
  }

  sortByDateFinished(notes) {
    return notes.sort((a, b) => a.finishedOn > b.finishedOn);
  }

  sortByPriority(notes) {
    return notes.sort((a, b) => a.priority < b.priority);
  }

  filterFinished(notes) {
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
