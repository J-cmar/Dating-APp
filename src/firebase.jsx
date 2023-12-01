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
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();


// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getStorage } from "firebase/storage";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyCBM7tXtSkZgostumFvBZ7AQaxihqb83Us",
//   authDomain: "chatmessagetrial.firebaseapp.com",
//   projectId: "chatmessagetrial",
//   storageBucket: "chatmessagetrial.appspot.com",
//   messagingSenderId: "6015286885",
//   appId: "1:6015286885:web:0c9964e0b85e0863f1108c"
// };

// // Initialize Firebase
// export const app = initializeApp(firebaseConfig);
// export const auth = getAuth();
// export const storage = getStorage();
// export const db = getFirestore()

