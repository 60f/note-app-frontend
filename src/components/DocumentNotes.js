import React, {useEffect, useState} from 'react';

import * as api from '../api.js';
import Note from './Note.js';
import NoteForm from './NoteForm.js';

export default function DocumentNotes({documentId}) {
  const [notes, setNotes] = useState([]);

  const [documentFocused, setDocumentFocused] = useState(true);

  // Needed for focusing the correct form after creating a new note.
  const [focusedNoteFormOffset, setFocusedNoteFormOffset] = useState(0);
  const [focusedNoteFormIndex, setFocusedNoteFormIndex] = useState(0);

  const [indentation, setIndentation] = useState('');

  function getNotes(initialLoad) {
    if (documentId !== null) {
      api
        .getNotes(documentId)
        .then((newNotes) => {
          if (!initialLoad) {
            setFocusedNoteFormOffset(
              focusedNoteFormOffset + (newNotes.length - notes.length)
            );
          }
          setNotes(newNotes);
        })
        .catch((error) => {
          alert(error);
        });
    }
  }

  // When changing document.
  useEffect(() => {
    setNotes([]);
    setDocumentFocused(true);
    setFocusedNoteFormOffset(0);
    setFocusedNoteFormIndex(0);
    getNotes(true);
  }, [documentId]);

  function handleKeyDown(event) {
    const UP = 38;
    const DOWN = 40;
    const ESCAPE = 27;
    const ENTER = 13;

    // Uncomment for key code debugging:
    // console.log('Key down:', event.keyCode);

    switch (event.keyCode) {
      case UP:
        if (focusedNoteFormIndex > 0 - focusedNoteFormOffset) {
          event.preventDefault();
          setDocumentFocused(true);
          setFocusedNoteFormIndex(focusedNoteFormIndex - 1);
        }
        break;
      case DOWN:
        if (focusedNoteFormIndex < notes.length - focusedNoteFormOffset) {
          event.preventDefault();
          setDocumentFocused(true);
          setFocusedNoteFormIndex(focusedNoteFormIndex + 1);
        }
        break;
      case ESCAPE:
        setDocumentFocused(false);
        break;
      case ENTER:
        if (!documentFocused) {
          setDocumentFocused(true);
        }
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return function cleanup() {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [notes, focusedNoteFormIndex, focusedNoteFormOffset, documentFocused]);

  function handleNoteCreate(index, text) {
    const newNotes = [
      ...notes.slice(0, index),
      {text: text},
      ...notes.slice(index),
    ];
    setNotes(newNotes);
    setFocusedNoteFormOffset(
      focusedNoteFormOffset + (newNotes.length - notes.length)
    );
  }

  function handleNoteTextChanged(text) {
    const INDENTATIONS = [
      '- ',
      '-',
      '+ ',
      '+',
      '* ',
      '*',
      '        ',
      '       ',
      '      ',
      '     ',
      '    ',
      '   ',
      '  ',
      ' ',
    ];
    const newIndentation = INDENTATIONS.find((indentation) => {
      return text.startsWith(indentation);
    });
    setIndentation(newIndentation !== undefined ? newIndentation : '');
  }

  function handleNoteCreated() {
    // getNotes(false);
  }

  function handleNoteDelete(id) {
    const newNotes = notes.map((note) => {
      return {
        ...note,
        deleted: note.id === id ? true : note.deleted,
      };
    });
    setNotes(newNotes);
  }

  function handleNoteDeleted() {
    // getNotes(false);
  }

  function handleNoteFormFocused(index) {
    setFocusedNoteFormIndex(index);
    setDocumentFocused(true);
  }

  return (
    <div className="DocumentNotes">
      <NoteForm
        key={documentId}
        documentId={documentId}
        index={0}
        focused={
          documentFocused && focusedNoteFormIndex === 0 - focusedNoteFormOffset
        }
        minimized={false}
        indentation={''}
        onTextChanged={(text) => handleNoteTextChanged(text)}
        onCreate={handleNoteCreate}
        onCreated={handleNoteCreated}
        onFocused={() => handleNoteFormFocused(0 - focusedNoteFormOffset)}
      />
      {notes.map((note, index) => (
        <React.Fragment key={index - focusedNoteFormOffset}>
          <Note
            id={note.id}
            text={note.text}
            deleted={note.deleted}
            onDelete={() => handleNoteDelete(note.id)}
            onDeleted={handleNoteDeleted}
          />
          {index < notes.length - 1 && (
            <NoteForm
              documentId={documentId}
              index={index + 1}
              focused={
                documentFocused &&
                index + 1 - focusedNoteFormOffset === focusedNoteFormIndex
              }
              minimized={
                !documentFocused ||
                index + 1 - focusedNoteFormOffset !== focusedNoteFormIndex
              }
              indentation={indentation}
              onTextChanged={(text) => handleNoteTextChanged(text)}
              onCreate={handleNoteCreate}
              onCreated={handleNoteCreated}
              onFocused={() =>
                handleNoteFormFocused(index + 1 - focusedNoteFormOffset)
              }
              onUnfocused={() => setFocusedNoteFormIndex(null)}
            />
          )}
        </React.Fragment>
      ))}
      {notes.length > 0 && (
        <NoteForm
          documentId={documentId}
          index={notes.length}
          focused={
            documentFocused &&
            focusedNoteFormIndex === notes.length - focusedNoteFormOffset
          }
          minimized={false}
          indentation={
            documentFocused &&
            focusedNoteFormIndex === notes.length - focusedNoteFormOffset
              ? indentation
              : ''
          }
          onTextChanged={(text) => handleNoteTextChanged(text)}
          onCreate={handleNoteCreate}
          onCreated={handleNoteCreated}
          onFocused={() =>
            handleNoteFormFocused(notes.length - focusedNoteFormOffset)
          }
        />
      )}
    </div>
  );
}
