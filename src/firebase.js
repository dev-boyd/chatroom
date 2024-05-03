// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBtxbKsl1mIZJ1uzIV4Zaiedvz9_qs9aro",

  authDomain: "chatapp-5bd40.firebaseapp.com",

  projectId: "chatapp-5bd40",

  storageBucket: "chatapp-5bd40.appspot.com",

  messagingSenderId: "217848818133",

  appId: "1:217848818133:web:eea2fe727ca0d37c9cb55c"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);
