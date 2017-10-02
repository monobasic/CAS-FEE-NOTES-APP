import NoteModel from './modules/NoteModel';
import NoteView from './modules/NoteView';
import NoteController from './modules/NoteController';


// Bootstrap Application
document.addEventListener("DOMContentLoaded", () => {
  let noteModel = new NoteModel();
  let noteView = new NoteView();
  let noteController = new NoteController(noteView, noteModel);
});







