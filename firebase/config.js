import { initializeApp } from "firebase/app";

import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCAElZzSkoeESXuOdkos1YHkdW-oFS39ic",
    authDomain: "maxivecchio-coderhouse-reactjs.firebaseapp.com",
    projectId: "maxivecchio-coderhouse-reactjs",
    storageBucket: "maxivecchio-coderhouse-reactjs.appspot.com",
    messagingSenderId: "450975361189",
    appId: "1:450975361189:web:212368a746b8e646ce854c"
};

const app = initializeApp(firebaseConfig);
const firestoreDatabase = getFirestore(app);

export {
    firestoreDatabase
}