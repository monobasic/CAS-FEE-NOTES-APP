import DataServiceAbstract from './DataServiceAbstract';

export default class DataServiceLocalStorage extends DataServiceAbstract {

  constructor() {
    super();

    if (!localStorage.getItem('notes')) {
      // Load fixture data
      this._notes = [
        {
          "_id": this._guid(),
          "title": "CAS FEE Selbststudium / Projekt Aufgabe erledigen",
          "due": "2018-01-22",
          "created": "2018-01-01",
          "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis doloribus earum enim, excepturi ipsa, itaque minima repellat saepe similique sint suscipit tempore totam. Accusantium error eveniet, maxime nemo quod unde.",
          "priority": 2,
          "finished": false,
          "finishedOn": ""
        },
        {
          "_id": this._guid(),
          "title": "Einkaufen",
          "due": "2017-12-01",
          "created": "2017-10-01",
          "description": "Consectetur adipisicing elit. Corporis doloribus earum enim, excepturi ipsa, itaque minima repellat saepe similique sint suscipit tempore totam. Accusantium error eveniet, maxime nemo quod unde.",
          "priority": 3,
          "finished": true,
          "finishedOn": "2018-02-22"
        },
        {
          "_id": this._guid(),
          "title": "Noch eine Note",
          "due": "2019-12-01",
          "created": "2017-10-09",
          "description": "Consectetur adipisicing elit. Corporis doloribus earum enim, excepturi ipsa, itaque minima repellat saepe similique sint suscipit tempore totam. Accusantium error eveniet, maxime nemo quod unde.",
          "priority": 5,
          "finished": false,
          "finishedOn": ""
        },
        {
          "_id": this._guid(),
          "title": "Eine Note",
          "due": "2019-10-01",
          "created": "2017-10-02",
          "description": "Corporis doloribus earum enim, excepturi ipsa, itaque minima repellat saepe similique sint suscipit tempore totam. Accusantium error eveniet, maxime nemo quod unde.",
          "priority": 2,
          "finished": false,
          "finishedOn": ""
        },
        {
          "_id": this._guid(),
          "title": "Mom anrufen",
          "due": "2019-02-22",
          "created": "2018-10-05",
          "description": "Tel. 041 111 22 33",
          "priority": 4,
          "finished": false,
          "finishedOn": ""
        }
      ];
      this._updateLocalStorage();
    } else {
      // Update notes object with data from localStorage
      this._notes = JSON.parse(localStorage.getItem('notes'));
    }
  }

  _guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  _updateLocalStorage() {
    localStorage.setItem('notes', JSON.stringify(this._notes));
    // Debug
    console.log('Updated localStorage!');
    console.log(JSON.parse(localStorage.getItem('notes')));
  }

  getNotes() {
    return new Promise((resolve, reject) => {
      resolve(this._notes);
    });
  }

  getNote(id) {
    return new Promise((resolve, reject) => {
      resolve(this._notes.find(note => note._id === id));
    });
  }

  addNote(note) {
    return new Promise((resolve, reject) => {
      console.log('add promise..');
      note._id = this._guid();
      this._notes.push(note);
      this._updateLocalStorage();
      resolve();
    });
  }

  deleteNote(id) {
    return new Promise((resolve, reject) => {
      this._notes.splice(this._notes.findIndex(note => note._id === id), 1);
      this._updateLocalStorage();
      resolve();
    });
  }

  updateNote(id, data) {
    return new Promise((resolve, reject) => {
      this._notes[this._notes.findIndex(note => note._id === id)] = data;
      this._updateLocalStorage();
      resolve();
    });
  }
}
