import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';



const firebaseConfig = {
    apiKey: "AIzaSyB_Huw_6LsBDH5NZj1sbbg4zpZqDZAA2Tk",
    authDomain: "teamate-c999b.firebaseapp.com",
    databaseURL: "https://teamate-c999b-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "teamate-c999b",
    storageBucket: "teamate-c999b.appspot.com",
    messagingSenderId: "732513377785",
    appId: "1:732513377785:web:db568840b621c99910f128"
};

// Initialize Firebase
// Initialize Firebase
const app = initializeApp(firebaseConfig,"app2");
const database = getDatabase(app); // Get the database instance

export { app, database };