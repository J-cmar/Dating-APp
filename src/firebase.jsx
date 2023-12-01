import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyDrC0eLL336PUqVZQGQaO4Y4KGj7noN3-w",
	authDomain: "dating-app-43ccb.firebaseapp.com",
	projectId: "dating-app-43ccb",
	storageBucket: "dating-app-43ccb.appspot.com",
	messagingSenderId: "476291162706",
	appId: "1:476291162706:web:b0cfca9978453873b7358b",
	measurementId: "G-7RGJQCW9E1",
};

// Initialize Firebase
// setPersistence(auth, browserSessionPersistence);

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
