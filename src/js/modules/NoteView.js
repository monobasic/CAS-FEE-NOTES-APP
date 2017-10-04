

export default class NoteView {

  constructor() {

  }

  renderNotesList(template, data) {
    let list = document.getElementById('list-notes');
    data.forEach((note) => {
      list.innerHTML += template(note);
    });
  }

}
