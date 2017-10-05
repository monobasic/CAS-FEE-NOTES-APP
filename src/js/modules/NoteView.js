

export default class NoteView {

  constructor() {

  }

  renderNotesList(template, data) {
    let list = document.getElementById('list-notes');
    list.innerHTML = '';
    data.forEach((note) => {
      list.innerHTML += template(note);
    });
  }

}
