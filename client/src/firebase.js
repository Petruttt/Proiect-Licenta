// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "licenta-b032a.firebaseapp.com",
  projectId: "licenta-b032a",
  storageBucket: "licenta-b032a.appspot.com",
  messagingSenderId: "1071307265524",
  appId: "1:1071307265524:web:98e9c761394335b2a655a1",
  measurementId: "G-YXNYJF9C2S"
};
export const app = initializeApp(firebaseConfig);
