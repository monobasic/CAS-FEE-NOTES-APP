'use strict';
import DataServiceRest from './modules/DataServiceRest';
//import DataServiceLocalStorage from './DataServiceLocalStorage';
import NoteModel from './modules/NoteModel';
import NoteController from './modules/NoteController';


// Bootstrap Application
document.addEventListener("DOMContentLoaded", () => {
  let noteModel = new NoteModel(new DataServiceRest());
  let noteController = new NoteController(noteModel);
});







