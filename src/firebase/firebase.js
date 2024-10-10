// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Only import getAuth if you are using Authentication
import { getFirestore } from "firebase/firestore"; // Import Firestore if needed

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMwbH6GPKMtgtKgle2bOYCMYFrf7Gby2s",
  authDomain: "srigadingsehat.firebaseapp.com",
  projectId: "srigadingsehat",
  storageBucket: "srigadingsehat.appspot.com",
  messagingSenderId: "839658613757",
  appId: "1:839658613757:web:79cab165cbced377328794",
  measurementId: "G-M3TJDFCYR4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize Firestore (if you need Firestore for database functionality)
const db = getFirestore(app);

// Export the instances for use in other parts of your app
export { auth, app, db };
