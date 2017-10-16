'use strict';

import NoteModel from './modules/NoteModel';
import NoteController from './modules/NoteController';


// Bootstrap Application
document.addEventListener("DOMContentLoaded", () => {
  let noteModel = new NoteModel();
  let noteController = new NoteController(noteModel);
});







