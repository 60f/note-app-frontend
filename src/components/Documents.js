import {useEffect, useState} from 'react';
import moment from 'moment';

import * as api from '../api.js';
import Spinner from './details/Spinner.js';

export default function Documents({activeDocumentId, onDocumentOpened}) {
  onDocumentOpened = onDocumentOpened || (() => {});

  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    api
      .getDocuments()
      .then((newDocuments) => {
        setDocuments(newDocuments);
        onDocumentOpened(newDocuments[0].id);
      })
      .catch((error) => {
        alert(error);
      });
  }, []);

  return (
    <div className="pb-2">
      {documents.length === 0 && <Spinner />}
      {documents.map((document, index) => {
        return (
          <div
            key={document.id}
            className={`cursor-pointer ${
              document.id === activeDocumentId ? 'bg-blue-300' : ''
            } ${index < documents.length - 1 ? 'border-b border-1' : ''}`}
            onMouseDown={() => onDocumentOpened(document.id)}
          >
            <h2
              className="pt-1 pb-1.5 min-h-min"
              title={`Last modified ${moment
                .unix(document.last_modified_date)
                .format('YYYY-MM-DD HH:mm:ss')}`}
            >
              {document.name}
              &nbsp;
            </h2>
          </div>
        );
      })}
    </div>
  );
}
