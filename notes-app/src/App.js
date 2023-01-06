import { useState, useEffect } from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { nanoid } from "nanoid"

export default function App() {

  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem("notes")) || [])

  const [currentNoteId, setCurrentNoteId] = useState(
    (notes[0] && notes[0].id) || ""
  )

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes))
  }, [notes])


  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "# Type your first note's title here"
    }
    setNotes(prevNotes => [newNote, ...prevNotes])
    setCurrentNoteId(newNote.id)
  }

  function updateNote(text) {
    // Put the most recently-modified note at the top
    setNotes(oldNotes => {
      const newArray = []
      for (let index = 0; index < oldNotes.length; index++) {
        const oldNote = oldNotes[index];
        if (oldNote.id === currentNoteId) {
          newArray.unshift({ ...oldNote, body: text })
        } else {
          newArray.push(oldNote)
        }
      }
      return newArray
    })
  }

  function deleteNote(event, noteId) {
    event.stopPropagation()
    setNotes(oldNote => oldNote.filter(oldNote => oldNote.id !== noteId))
  }

  function findCurrentNote() {
    return notes.find(note => {
      return note.id === currentNoteId
    }) || notes[0]
  }

  return (
    <main>
      {
        notes.length > 0
          ?
          <Split
            sizes={[30, 70]}
            direction="horizontal"
            className="split"
          >
            <Sidebar
              notes={notes}
              currentNote={findCurrentNote()}
              setCurrentNoteId={setCurrentNoteId}
              newNote={createNewNote}
              deleteNote={deleteNote}
            />
            {
              currentNoteId &&
              notes.length > 0 &&
              <Editor
                currentNote={findCurrentNote()}
                updateNote={updateNote}
              />
            }
          </Split>
          :
          <div className="no-notes">
            <h1>You have no notes</h1>
            <button
              className="first-note"
              onClick={createNewNote}
            >
              Create Note
            </button>
          </div>

      }
    </main>
  )
}
