class NoteModel {

  constructor() {
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
    this.init();
  }

  getTasks() {
    return this.notes;
  }
}
