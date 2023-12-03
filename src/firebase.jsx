import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyCs547ZitkI5-IVY-1xGhdzkkOdRX3hO-c",
	authDomain: "datingapptrial.firebaseapp.com",
	projectId: "datingapptrial",
	storageBucket: "datingapptrial.appspot.com",
	messagingSenderId: "346468110355",
	appId: "1:346468110355:web:3ff59ca6519d6e3822afe6",
	measurementId: "G-YFQYBQ2J3V"
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

