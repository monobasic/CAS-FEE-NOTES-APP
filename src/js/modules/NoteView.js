import Pikaday from 'pikaday';

export default class NoteView {

  constructor() {
    this.datepicker = new Pikaday({
      field: document.getElementById('due'),
      format: 'D.MM.YYYY'
    });
  }



  renderNotesList(notes) {
    console.log('Render Notes List...');
  }
}
