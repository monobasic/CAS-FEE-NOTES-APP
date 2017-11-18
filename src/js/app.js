'use strict';

// Instead of using the REST API Service, you can swap to Local-Storage with:
// import DataServiceLocalStorage from './DataServiceLocalStorage';
import DataServiceRest from './modules/DataServiceRest';
import NoteModel from './modules/NoteModel';
import NoteController from './modules/NoteController';

import '../scss/themes/default/styles.scss';

// Bootstrap Application
document.addEventListener("DOMContentLoaded", () => {
  const noteModel = new NoteModel(new DataServiceRest());
  const noteController = new NoteController(noteModel);
});







