export default class DataServiceLocalStorage {

  constructor() {
    if (!localStorage.getItem('notes')) {
      // Load fixture data
      this._notes = [
        {
          "title": "CAS FEE Selbststudium / Projekt Aufgabe erledigen",
          "due": "2018-01-22T07:46:36.611Z",
          "created": "2018-01-01T07:33:36.611Z",
          "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis doloribus earum enim, excepturi ipsa, itaque minima repellat saepe similique sint suscipit tempore totam. Accusantium error eveniet, maxime nemo quod unde.",
          "priority": 2,
          "finished": false,
          "finishedOn": ""
        },
        {
          "title": "Einkaufen",
          "due": "2017-12-01T16:12:36.611Z",
          "created": "2017-10-01T14:12:36.611Z",
          "description": "Consectetur adipisicing elit. Corporis doloribus earum enim, excepturi ipsa, itaque minima repellat saepe similique sint suscipit tempore totam. Accusantium error eveniet, maxime nemo quod unde.",
          "priority": 3,
          "finished": true,
          "finishedOn": "2018-02-22T07:46:36.611Z"
        },
        {
          "title": "Mom anrufen",
          "due": "2019-02-22T12:41:36.611Z",
          "created": "2018-10-05T07:46:36.611Z",
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

  _updateLocalStorage() {
    localStorage.setItem('notes', JSON.stringify(this._notes));
    // Debug
    console.log('Updated localStorage!');
    console.log(JSON.parse(localStorage.getItem('notes')));
  }

  getNotes() {
    return this._notes;
  }

  getNote(index) {
    return this._notes[index];
  }

  addNote(note) {
    this._notes.push(note);
    this._updateLocalStorage();
  }

  deleteNote(index) {
    this._notes.splice(index, 1);
    this._updateLocalStorage();
  }
}
