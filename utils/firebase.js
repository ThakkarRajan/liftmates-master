



// utils/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyByaz9b4sG7m-Kr48iCqTbm1oK6AOUAxZU",
  authDomain: "liftmate-4e4b6.firebaseapp.com",
  databaseURL: "https://liftmate-4e4b6-default-rtdb.firebaseio.com",
  projectId: "liftmate-4e4b6",
  storageBucket: "liftmate-4e4b6.appspot.com",
  messagingSenderId: "671787466774",
  appId: "1:671787466774:web:9c8a4b78a5166bf47d7537"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);
const storage = getStorage(app);

export { auth, db , database, storage };