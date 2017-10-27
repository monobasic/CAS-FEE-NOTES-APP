const express = require('express');
const router = express.Router();
const notesController = require('../controller/notesController.js');

router.get("/notes", notesController.getNotes);
router.post("/notes", notesController.createNote);
router.get("/notes/:id/", notesController.getNote);
// router.delete("/notes/:id/", notesController.deleteNote);

module.exports = router;
