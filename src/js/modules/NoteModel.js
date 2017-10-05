export default class NoteModel {

  constructor() {
    if (!localStorage.getItem('notes')) {
      // Load fixture data
      this._notes = [
        {
          "title": "CAS FEE Selbststudium / Projekt Aufgabe erledigen",
          "due": "22.01.2018",
          "created": "01.01.2018",
          "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis doloribus earum enim, excepturi ipsa, itaque minima repellat saepe similique sint suscipit tempore totam. Accusantium error eveniet, maxime nemo quod unde.",
          "priority": 3,
          "finished": false,
          "finishedOn": ""
        },
        {
          "title": "Einkaufen",
          "due": "01.12.2017",
          "created": "1.10.2017",
          "description": "Consectetur adipisicing elit. Corporis doloribus earum enim, excepturi ipsa, itaque minima repellat saepe similique sint suscipit tempore totam. Accusantium error eveniet, maxime nemo quod unde.",
          "priority": 4,
          "finished": true,
          "finishedOn": "22.2.2018"
        },
        {
          "title": "Mom anrufen",
          "due": "22.11.2019",
          "created": "05.10.2018",
          "description": "Tel. 041 111 22 33",
          "priority": 5,
          "finished": false,
          "finishedOn": ""
        }
      ];
      this._updateLocalStorage(this._notes);
    } else {
      // Update notes object with data from localStorage
      this._notes = JSON.parse(localStorage.getItem('notes'));
    }
  }

  getNotes() {
    return this._notes;
  }

  getNote(index) {
    return this._notes[index];
  }

  addNote(note) {
    this._notes.push(note);
    this._updateLocalStorage(this._notes);
  }

  deleteNote(index) {
    this._notes.splice(index, 1);
    this._updateLocalStorage(this._notes);
  }

  _updateLocalStorage(notes) {
    localStorage.setItem('notes', JSON.stringify(notes));
    // Debug
    console.log('Updated localStorage!');
    console.log(JSON.parse(localStorage.getItem('notes')));
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
    return notes.sort((a, b) => a.priority > b.priority);
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
