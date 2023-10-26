import React, { useRef, useState, useContext, useEffect } from 'react';
import NoteContext from '../context/notes/NoteContext';
import AlertContext from '../context/alert/AlertContext'

const UpdateNote = ({note, onClose}) => {
    const context = useContext(NoteContext);
    const { editNote } = context;
    const Alertcontext = useContext(AlertContext);
    const { setAlertMessage } = Alertcontext;

    const refOpen = useRef(null);
    const refClose = useRef(null);
    const [editedNote, setEditedNote] = useState({
        id: note._id,
        etitle: note.title,
        edescription: note.description,
        etag: note.tag,
        edate: note.date
    });

    useEffect(() => {
        if (note) {
            refOpen.current.click(); // Open the modal when a note is passed as a prop
        }
    },[]);

    const handleSave = () => {
        const currentDate = new Date();
        editNote(editedNote.id, editedNote.etitle, editedNote.edescription, editedNote.etag, currentDate);
        onClose();
        refClose.current.click();
        setAlertMessage("Note updated successfully", "success")
    };

    const handleClose =() => {
        onClose();
        refClose.current.click();
        setAlertMessage("Note isn't updated", "danger")
    }

    const onChange = (e) => {
        setEditedNote({ ...editedNote, [e.target.name]: e.target.value });
    }

    return (
        <div>
            <button ref={refOpen} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                Update Note
            </button>
            <div className="modal fade modal-lg" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
                            <button onClick={handleClose} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form className="my-3">
                                <div className="mb-3">
                                    <label htmlFor="etitle" className="form-label">Title</label>
                                    <input type="text" className="form-control" id="etitle" name="etitle" value={editedNote.etitle} onChange={onChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="edescription" className="form-label">Description</label>
                                    <input type="text" className="form-control" id="edescription" name="edescription" value={editedNote.edescription} onChange={onChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="etag" className="form-label">Tag</label>
                                    <input type="text" className="form-control" id="etag" name="etag" value={editedNote.etag} onChange={onChange} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button onClick={handleClose} ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button disabled={editedNote.etitle.length<3 || editedNote.edescription.length<5} onClick={handleSave} type="button" className="btn btn-primary">Update Note</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateNote;
