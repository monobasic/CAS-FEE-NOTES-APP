'use strict';
// Import Modules
import NoteModel from './modules/NoteModel';
import NoteController from './modules/NoteController';

// Import Styles
import '../scss/themes/default/styles.scss';

// Bootstrap Application
document.addEventListener("DOMContentLoaded", () => {
  let noteModel = new NoteModel();
  let noteController = new NoteController(noteModel);
});







