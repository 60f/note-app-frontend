import {useState, useEffect} from 'react';

import * as api from '../api.js';
import Spinner from './details/Spinner.js';
import DocumentNotes from './DocumentNotes.js';

export default function Document({id}) {
  const [document, setDocument] = useState(null);

  useEffect(() => {
    setDocument(null);
    if (id !== null) {
      api
        .getDocument(id)
        .then((document) => {
          setDocument(document);
        })
        .catch((error) => {
          alert(error);
        });
    }
  }, [id]);

  return (
    <div className="Document">
      {document === null && <Spinner />}
      <h1 className="Document__name mb-4 font-bold">
        {document !== null ? document.name : ''}
        &nbsp;
      </h1>
      <DocumentNotes documentId={id} />
    </div>
  );
}
