import React, { useContext, useEffect, useState } from 'react'
import NoteContext from '../context/notes/NoteContext'
import Noteitem from './Noteitem';
import AddNote from './AddNote';
import UpdateNote from './UpdateNote';


const Notes = () => {
    const context = useContext(NoteContext);
    const { notes, getNotes } = context;
    useEffect(() => {
        getNotes();

    }, []);

    const [selectedNote, setSelectedNote] = useState(null);

    const updateNote = (currentNote) => {
        setSelectedNote(currentNote);
    }

    const handleCloseUpdateNote = () => {
        setSelectedNote(null);
    }

    return (
        <>
            <AddNote />
            {selectedNote !== null && <UpdateNote note={selectedNote} onClose={handleCloseUpdateNote} />}
            <div className="container mt-4 mx-5">
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
