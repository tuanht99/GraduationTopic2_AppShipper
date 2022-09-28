import { initializeApp } from 'firebase/app';
import {getFirestore} from 'firebase/firestore';


// Optionally import the services that you want to use
//import {...} from "firebase/auth";
//import {...} from "firebase/database";
//import {...} from "firebase/firestore";
//import {...} from "firebase/functions";
//import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
   apiKey: "AIzaSyBV-Nfde7mruHw5oijQZJhntcoaf7pNCaE",
  authDomain: "freentship.firebaseapp.com",
  projectId: "freentship",
  storageBucket: "freentship.appspot.com",
  messagingSenderId: "846127148037",
  appId: "1:846127148037:web:1efdff80921f9cd091c06c",
  measurementId: "G-RC4Y35R9R1"
};

export const myApp =  initializeApp(firebaseConfig);
export const db = getFirestore(myApp);
