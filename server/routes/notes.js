const express = require('express');
const fetchuser = require('../middleware/fetctuser');
const router = express.Router();
const Note = require('../models/Note')
const { body, validationResult } = require('express-validator');

// ROUTE1: Endpoint for fetching all the notes /api/notes/fetchnotes : login required
router.get('/fetchnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error.' });
    }
})

// ROUTE2: Endpoint for adding a new note /api/notes/addnote : login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title with minimum 3 character').isLength({ min: 3 }),
    body('description', 'Description must have at least 5 character').isLength({ min: 5 }),
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;

        // If there are errors return bad request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save();
        res.status(200).json(savedNote);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error.' });
    }
})

// ROUTE3: Endpoint for updating a note /api/notes/updatenote : login required
router.put('/updatenote/:id', fetchuser, [
    body('title', 'Enter a valid title with minimum 3 character').isLength({ min: 3 }),
    body('description', 'Description must have at least 5 character').isLength({ min: 5 }),
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        // If there are errors return bad request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // Create a new Note object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // Find the note to be updated and update it
        let note = await Note.findById(req.params.id)
        if (!note) {
            return res.status(404).send("Not Found!!");
        };
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed!");
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json(note);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error.' });
    }
})

// ROUTE4: Endpoint for deleting a note /api/notes/deletenote : login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be deleted and delete it
        let note = await Note.findById(req.params.id)
        if (!note) {
            return res.status(404).send("Not Found!!");
        };

        // Allow deletion only if user owns this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed!");
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ success: `Note with Id ${req.params.id} has been deleted`, note: note });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error.' });
    }
})

module.exports = router