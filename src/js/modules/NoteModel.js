export default class NoteModel {

  constructor() {
    if (!localStorage.getItem('notes')) {
      // Load fixture data
      this.notes = this.notes = [
        {
          "title": "CAS FEE Selbststudium / Projekt Aufgabe erledigen",
          "due": "",
          "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis doloribus earum enim, excepturi ipsa, itaque minima repellat saepe similique sint suscipit tempore totam. Accusantium error eveniet, maxime nemo quod unde.",
          "priority": 2,
          "finished": false
        },
        {
          "title": "Einkaufen",
          "due": "",
          "description": "Consectetur adipisicing elit. Corporis doloribus earum enim, excepturi ipsa, itaque minima repellat saepe similique sint suscipit tempore totam. Accusantium error eveniet, maxime nemo quod unde.",
          "priority": 2,
          "finished": false
        },
        {
          "title": "Mom anrufen",
          "due": "",
          "description": "Tel. 041 111 22 33",
          "priority": 2,
          "finished": false
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

  loadTemplate(template, callback) {
    return new Promise(function(resolve, reject) {
      // Do the usual XHR stuff
      let request = new XMLHttpRequest();
      request.open('GET', `./templates/${template}.hbs`, true);

      request.onload = function() {
        // This is called even on 404 etc
        // so check the status
        if (request.status == 200) {
          // Resolve the promise with the response text
          resolve(request.response);
        }
        else {
          // Otherwise reject with the status text
          // which will hopefully be a meaningful error
          reject(Error(request.statusText));
        }
      };

      // Handle network errors
      request.onerror = function() {
        reject(Error("Network Error"));
      };

      // Make the request
      request.send();
    });
  }

}

