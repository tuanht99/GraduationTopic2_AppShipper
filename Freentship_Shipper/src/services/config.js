// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBV-Nfde7mruHw5oijQZJhntcoaf7pNCaE",
  authDomain: "freentship.firebaseapp.com",
  projectId: "freentship",
  storageBucket: "freentship.appspot.com",
  messagingSenderId: "846127148037",
  appId: "1:846127148037:web:1efdff80921f9cd091c06c",
  measurementId: "G-RC4Y35R9R1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const provider = new firebase.auth.GoogleAuthProvider();

export const db = getFirestore(app);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;