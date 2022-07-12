import {useState} from 'react';
import {Helmet, HelmetProvider} from 'react-helmet-async';

import './App.scss';
import Document from './components/Document.js';
import Documents from './components/Documents';
import * as api from './api.js';
import LoginForm from './components/LoginForm';

function App() {
  const [documentId, setDocumentId] = useState(null);

  const handleDocumentOpened = (id) => {
    setDocumentId(id);
  };

  const handleCreateDocument = () => {
    const name = prompt('Enter name for new document');
    if (name) {
      api
        .createDocument(name)
        .then(() => {
          window.location.reload();
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Note App</title>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;700&display=swap"
            rel="stylesheet"
          />
        </Helmet>
        <LoginForm />
        <div className="App text-black text-base">
          <div className="container mx-auto px-4 md:px-8 pt-16 pb-28">
            <h1 className="text-3xl mb-4">Note App</h1>
            <div className="md:flex">
              <div className="App__documents md:flex-none md:w-64 mb-8 max-h-40 md:max-h-screen overflow-y-auto">
                <div className="mb-4">
                  <button
                    className="w-full text-left"
                    onClick={() => handleCreateDocument()}
                  >
                    + Create document
                  </button>
                </div>
                <Documents
                  activeDocumentId={documentId}
                  onDocumentOpened={(id) => handleDocumentOpened(id)}
                />
              </div>
              <div className="md:flex-1 md:pl-4">
                {documentId !== null && <Document id={documentId} />}
              </div>
            </div>
          </div>
        </div>
      </HelmetProvider>
    </>
  );
}

export default App;
