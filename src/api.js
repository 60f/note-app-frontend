const axios = require('axios');

export const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL ||
  `http://${window.location.hostname}:8080`;

export const getDocument = async (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BACKEND_URL}/documents/${id}`)
      .then((response) => {
        resolve(response.data[0]);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getDocuments = async () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BACKEND_URL}/documents`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const createDocument = async (name) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${BACKEND_URL}/documents`, {
        name: name,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getNotes = async (documentId) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BACKEND_URL}/documents/${documentId}/notes`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export let previousNoteCreateTime = 0;

export const createNote = async (documentId, index, text) => {
  previousNoteCreateTime = 0;
  return new Promise((resolve, reject) => {
    axios
      .post(`${BACKEND_URL}/documents/${documentId}/notes`, {
        index: index,
        text: text,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const deleteNote = async (id) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${BACKEND_URL}/notes/${id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
