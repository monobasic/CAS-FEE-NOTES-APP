export default class NoteModel {

  constructor() {
    if (!localStorage.getItem('notes')) {
      // Load fixture data
      this.notes = this.notes = [
        {
          "title": "CAS FEE Selbststudium / Projekt Aufgabe erledigen",
          "due": "22.01.2018",
          "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis doloribus earum enim, excepturi ipsa, itaque minima repellat saepe similique sint suscipit tempore totam. Accusantium error eveniet, maxime nemo quod unde.",
          "priority": 2,
          "finished": false,
          "finishedOn": ""
        },
        {
          "title": "Einkaufen",
          "due": "01.12.2017",
          "description": "Consectetur adipisicing elit. Corporis doloribus earum enim, excepturi ipsa, itaque minima repellat saepe similique sint suscipit tempore totam. Accusantium error eveniet, maxime nemo quod unde.",
          "priority": 2,
          "finished": true,
          "finishedOn": "22.2.2018"
        },
        {
          "title": "Mom anrufen",
          "due": "22.11.2019",
          "description": "Tel. 041 111 22 33",
          "priority": 2,
          "finished": false,
          "finishedOn": ""
        }
      ];
      this.updateLocalStorage(this.notes);
    } else {
      // Update notes object with data from localStorage
      this.notes = JSON.parse(localStorage.getItem('notes'));
    }
  }

  getNotes() {
    return this.notes;
  }

  getNote(index) {
    return this.notes[index];
  }

  addNote(note) {
    this.notes.push(note);
    this.updateLocalStorage(this.notes);
  }

  deleteNote(index) {
    this.notes.splice(index, 1);
    this.updateLocalStorage(this.notes);
  }

  updateLocalStorage(notes) {
    localStorage.setItem('notes', JSON.stringify(notes));
    // Debug
    console.log('Updated localStorage!');
    console.log(JSON.parse(localStorage.getItem('notes')));
  }

  sortByDateDue(notes) {
    return notes.sort((a, b) => {
      return a.due > b.due;
    });
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
