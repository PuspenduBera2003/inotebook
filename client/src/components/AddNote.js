import React, { useContext, useState } from 'react'
import NoteContext from '../context/notes/NoteContext'

const AddNote = (props) => {
    const context = useContext(NoteContext);
    const { addNote } = context;
    const [note, setNote] = useState({ title: "", description: "", tag: "default" });

    const handleSubmit = (e) => {
        e.preventDefault();
        addNote(note.title, note.description, note.tag);
        props.addNoteSuccess();
    }

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    }

    return (
        <div className='container my-3'>
            <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                    <input type="text" className="form-control" id="title" name='title' placeholder="title" onChange={onChange} />
                    <label htmlFor="title">Title</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="text" className="form-control" id="description" name='description' placeholder="description" onChange={onChange} />
                    <label htmlFor="description">Description</label>
                </div>
                <div className="form-floating mb-4">
                    <input type="text" className="form-control" id="tag" name='tag' placeholder="tag" onChange={onChange} />
                    <label htmlFor="tag">Tag</label>
                </div>
                <button disabled={note.title.length < 3 || note.description.length < 5} type="submit" className="btn btn-primary">Add Note</button>
            </form>
            <button className="btn btn-primary mt-3" onClick={props.addNoteAborted}>Close</button>
        </div>
    );
}

export default AddNote;
