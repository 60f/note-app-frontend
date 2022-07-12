import Autolinker from 'autolinker';

import './Note.scss';
import * as api from '../api.js';
import React from 'react';

export default function Note({id, text, deleted, onDelete, onDeleted}) {
  deleted = !!deleted;
  onDelete = onDelete || (() => {});
  onDeleted = onDeleted || (() => {});

  const autolinker = new Autolinker({
    sanitizeHtml: true,
    hashtag: false,
    stripPrefix: false,
    stripTrailingSlash: false,
  });

  function handleDeleted() {
    onDelete();
    api
      .deleteNote(id)
      .then(() => {
        onDeleted();
      })
      .catch((error) => {
        alert(error);
      });
  }

  return (
    <div className={`Note flex ${deleted ? 'Note--deleted' : ''}`}>
      <p
        className={`Note__text flex-1 whitespace-pre-wrap ${
          deleted ? 'line-through text-gray-300' : ''
        }`}
        dangerouslySetInnerHTML={{__html: autolinker.link(text)}}
      ></p>
      {id && (
        <>
          <div
            className="Note__delete-button flex-initial cursor-pointer font-bold"
            onMouseDown={handleDeleted}
          >
            x
          </div>
        </>
      )}
    </div>
  );
}
