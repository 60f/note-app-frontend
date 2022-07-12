import {useState, useRef, useEffect} from 'react';

import * as api from '../api.js';
import './NoteForm.scss';

export default function NoteForm({
  documentId,
  index,
  focused,
  minimized,
  indentation,
  onTextChanged,
  onCreate,
  onCreated,
  onFocused,
  onUnfocused,
}) {
  focused = focused || false;
  minimized = minimized || false;
  onTextChanged = onTextChanged || (() => {});
  onCreate = onCreate || (() => {});
  onCreated = onCreated || (() => {});
  onFocused = onFocused || (() => {});
  onUnfocused = onUnfocused || (() => {});

  const [newNoteText, setNewNoteText] = useState(indentation);
  const inputElement = useRef(null);

  useEffect(() => {
    if (focused && inputElement.current !== null) {
      // Hack: Needs setTimeout or somehow the input element does not
      // get focused when opening other documents.
      setTimeout(() => {
        inputElement.current.focus();
      }, 0);
    } else {
      reset();
    }
  }, [documentId, focused]);

  function handleNoteSubmitted() {
    onCreate(index, newNoteText);
    reset();
    api
      .createNote(documentId, index, newNoteText)
      .then(() => {
        onCreated();
      })
      .catch((error) => {
        alert(error);
      });
  }

  function reset() {
    setNewNoteText(indentation);
  }

  function handleTextChanged(text) {
    setNewNoteText(text);
    onTextChanged(text);
  }

  return (
    <div className="NoteForm">
      {minimized && (
        <div
          className="NoteForm__line text-transparent font-bold hover:text-inherit"
          onMouseDown={(event) => {
            event.preventDefault();
            onFocused();
          }}
        ></div>
      )}
      {!minimized && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleNoteSubmitted();
          }}
        >
          <input
            type="text"
            placeholder="..."
            className="w-full outline-none pt-1 pb-1.5 bg-gray-100 placeholder-gray-400"
            ref={inputElement}
            value={newNoteText}
            onChange={(event) => handleTextChanged(event.target.value)}
            onFocus={() => onFocused()}
            onBlur={() => onUnfocused()}
          />
        </form>
      )}
    </div>
  );
}
