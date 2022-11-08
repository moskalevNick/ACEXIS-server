import { initializeApp } from 'firebase/app';

export function initializeFirebaseApp() {
  const serviceAccount = {
    apiKey: 'AIzaSyAaed5wB9_qWZJlySRk8-llXK9mlU-7R-E',
    authDomain: 'acexis-c375d.firebaseapp.com',
    projectId: 'acexis-c375d',
    storageBucket: 'acexis-c375d.appspot.com',
    messagingSenderId: '1085458018160',
    appId: '1:1085458018160:web:61b04a650e09622340a9b5',
  };
  initializeApp(serviceAccount);
}
