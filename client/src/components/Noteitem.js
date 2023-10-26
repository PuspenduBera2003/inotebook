import React, {useContext} from 'react'
import NoteContext from '../context/notes/NoteContext'
import { formatDate } from '../utilities/DateFormater';

const Noteitem = (props) => {
    const { note, updateNote } = props;
    const formattedDate = formatDate(note.date)
    const context = useContext(NoteContext);
    const { deleteNote } = context;
    return (
        <div className="container mb-3" style={{ maxWidth: '20rem' }}>
            <div className="card text-center">
                <div className="card-header">
                    <span>
                        <i className="fa-solid fa-tag mx-1"></i>
                        {note.tag}
                    </span>
                </div>
                <div className="card-body">
                    <h5 className="card-title">{note.title}</h5>
                    <p className="card-text">{note.description}</p>
                </div>
                <div className="card-footer text-body-secondary">
                    {formattedDate}
                </div>
                <div className="card-footer text-body-secondary d-flex justify-content-center">
                    <i className="fa-solid fa-pen-to-square mx-3" onClick={()=>{updateNote(note)}}></i>
                    <i className="fa-sharp fa-solid fa-trash mx-3" onClick={()=>{deleteNote(note._id)}}></i>
                </div>
            </div>
        </div>
    )
}

export default Noteitem
