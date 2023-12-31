import React, { useState, useContext } from "react";
import NoteContext from "./NoteContext";
import AlertContext from "../alert/AlertContext";

const NoteState = (props) => {
    const Alertcontext = useContext(AlertContext);
    const { setAlertMessage } = Alertcontext;
    const host = "http://localhost:5000"
    const InitialNotes = []
    const [notes, setNotes] = useState(InitialNotes)

    // Get All Notes
    const getNotes = async () => {
        // API call
        const url = `${host}/api/notes/fetchnotes`
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('iNotebookToken')

            },
        });
        
        // Showing All Notes at Client Side
        const json = await response.json()
        setNotes(json)
    }

    // Add a Note
    const addNote = async (title, description, tag) => {
        // API call
        const url = `${host}/api/notes/addnote`
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('iNotebookToken')

            },
            body: JSON.stringify({ title, description, tag }),
        });
        // Adding note in client side
        const note = await response.json()

        setNotes(notes.concat(note));
    }

    //Delete a Note
    const deleteNote = async (id) => {
        // API call
        const url = `${host}/api/notes/deletenote/${id}`
        await fetch(url, {

            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('iNotebookToken')

            },
        });
        // Logic to delete at the client side

        const newNotes = notes.filter((note) => { return note._id !== id });
        setNotes(newNotes);

        setAlertMessage("Note deleted successfully", "success")
    }

    // Edit a Note
    const editNote = async (id, title, description, tag, date) => {
        // API call
        const url = `${host}/api/notes/updatenote/${id}`
        await fetch(url, {
            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('iNotebookToken')

            },
            body: JSON.stringify({ title, description, tag }),
        });
        // Logic to edit in client side
        let newNotes = JSON.parse(JSON.stringify(notes))
        for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];
            if (element._id === id) {
                newNotes[index].title = title;
                newNotes[index].description = description;
                newNotes[index].tag = tag;
                newNotes[index].date = date;
                break;
            }
        }
        setNotes(newNotes) 
    }


    return (
        <NoteContext.Provider value={{ notes, addNote, editNote, deleteNote, getNotes }}>
            {props.children}
        </NoteContext.Provider >
    )

}

export default NoteState;