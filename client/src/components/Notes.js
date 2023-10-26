import React, { useContext, useEffect, useState } from 'react'
import NoteContext from '../context/notes/NoteContext'
import Noteitem from './Noteitem';
import AddNote from './AddNote';
import UpdateNote from './UpdateNote';
import AlertContext from '../context/alert/AlertContext'


const Notes = () => {
    const context = useContext(NoteContext);
    const { notes, getNotes } = context;
    const Alertcontext = useContext(AlertContext);
    const { setAlertMessage } = Alertcontext;

    useEffect(() => {
        getNotes();
    }, []);

    const [selectedNote, setSelectedNote] = useState(null);
    const [newNote, setNewNote] = useState(false);

    const addNote = () => {
        let addNotebtn = document.getElementById('addNote');
        addNotebtn.style.display="none";
        setNewNote(true)
    }

    const addNoteAborted = () => {
        let addNotebtn = document.getElementById('addNote');
        addNotebtn.style.display="block";
        setNewNote(false);
        setAlertMessage("Note isn't added", "danger");
    }

    const addNoteSuccess = () => {
        let addNotebtn = document.getElementById('addNote');
        addNotebtn.style.display="block";
        setNewNote(false);
        setAlertMessage("Note added successfully", "success");
    }

    const updateNote = (currentNote) => {
        setSelectedNote(currentNote);
    }

    const handleCloseUpdateNote = () => {
        setSelectedNote(null)
    }

    return (
        <>
            <button id='addNote' className='btn btn-dark mx-5 my-3' onClick={addNote}>
                <i className="fa-sharp fa-solid fa-plus"></i>
                <h6 className="card-header" style={{display: 'inline'}}> Add New Note</h6>
            </button>
            {newNote && <AddNote addNoteSuccess={addNoteSuccess} addNoteAborted={addNoteAborted} />}
            {selectedNote !== null && <UpdateNote note={selectedNote} onClose={handleCloseUpdateNote} />}
            <div className="container mt-2 mx-5">
                <h4 className="card-header">Your Notes</h4>
            </div>
            <div className="container mx-5 my-3">
                {notes.length === 0 && 'No notes created'}
            </div>
            <div className='container d-flex flex-wrap mt-5'>
                {
                    notes.map((note) => (
                        <Noteitem note={note} updateNote={() => updateNote(note)} key={note._id} />

                    ))
                }
            </div>
        </>
    )
}

export default Notes
