'use strict';

import DataServiceLocalStorage from './DataServiceLocalStorage';

export default class NoteModel {

  constructor() {
    this._dataService = new DataServiceLocalStorage();
  }

  getNotes() {
    return this._dataService.getNotes();
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
