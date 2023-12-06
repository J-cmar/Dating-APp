import { useState } from 'react';
import { collection, doc, setDoc, getDoc, query, where, serverTimestamp, getDocs, updateDoc, arrayUnion } from "firebase/firestore";
import { db, auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect } from 'react';
import account from '../img/blank-avatar.png';
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../context/ChatContext";
import './index.css';
import { signOut } from "firebase/auth"


function timeout(delay) {
  return new Promise(res => setTimeout(res, delay));
}

// grabs the user location
const getUserLocation = async (uid) => {
  const userRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userRef);
  console.log("userDoc first: " + userDoc);
  console.log("location 2: " + userDoc.data().location);
  return userDoc.data()?.location || null;
}

const returnUsers = async (location, uid) => {
  let usersRef = collection(db, 'users');
  let q = query(usersRef, where("location", "==", location));

  const querySnapshot = await getDocs(q);
  const users = querySnapshot.docs
    .filter(doc => doc.id !== uid)
    .map(doc => ({ ...doc.data(), uid: doc.id }));
  return users;
};

const getUserLiked = async (uid) => {
  const userRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userRef);
  return userDoc.data()?.liked || null;
}

const getUserDisliked = async (uid) => {
  const userRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userRef);
  return userDoc.data()?.disliked || null;
}

const Home = () => {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { dispatch } = useContext(ChatContext);

  if (currentUser == null) {
    navigate("/login")
  } else {
    // console.log('not null')
  }

  useEffect(() => {
    const fetchData = async () => {
      const userLocation = await getUserLocation(currentUser.uid);
      if (userLocation) {
        const usersInLocation = await returnUsers(userLocation, currentUser.uid);
        setUsers(usersInLocation);
      }
    };
    fetchData();
  }, [currentUser.uid]);

  useEffect(() => {
    generateUserViewed();
  });

  const generateUserViewed = () => {
    const currentUserViewed = users[currentIndex];
    if (currentUserViewed) {
      document.getElementById("img").src = currentUserViewed.viewPhotoURL || account;
      document.getElementById("name").textContent = currentUserViewed.displayName || '';
      document.getElementById("age").textContent = currentUserViewed.age + ", Cal Poly Pomona" || '';
      document.getElementById("bio").textContent = currentUserViewed.bio || '';
      document.getElementById("location").textContent = currentUserViewed.location + ", CA" || '';
      document.getElementById("major").textContent = currentUserViewed.major || '';
    }
  }

  const hitLike = async () => {
    // grab the user that they are currently viewing
    const user = users[currentIndex];
    const userLiked = await getUserLiked(user.uid);
    const userDisliked = await getUserDisliked(user.uid);

    // see if this person has like the current user before
    if (userLiked != null && userLiked.includes(currentUser.uid)) {
      // they have liked this user before
      // check whether the group(chats in firestore) exists, if not create
      const combinedId =
        currentUser.uid > user.uid
          ? currentUser.uid + user.uid
          : user.uid + currentUser.uid;
      try {
        // technically creates this?
        const res = await getDoc(doc(db, "chats", combinedId));
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
        //create user chats for current user and other user since they matched
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
        console.log("does it get past the first user chat?");
        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        const heart = document.getElementById("heartStuff");
        heart.hidden = false;

        await timeout(2000);
        navigate("/chatsPage");




        // navigate to the user info of this new chat message and push to the chatContext.jsx file
        // this will render that chat in the chats page
        const currentRef = doc(db, "userChats", currentUser.uid);
        const userDoc = await getDoc(currentRef);
        const temp = userDoc.data();
        const temp2 = Object.entries(temp);
        const length = temp2.length;
        // this is going to grab the most recently made user chat, which should be this one that has just been made
        const userField = temp2[length - 1];
        const temp3 = userField[1].userInfo;
        dispatch({ type: "CHANGE_USER", payload: temp3 });
      } catch (err) { console.log("") }
    } else if (userDisliked != null && userDisliked.includes(currentUser.uid)) {
      // NEED TO ADD STUFF HERE
      console.log("did not match!");
    } else {
      const currentRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(currentRef);
      const newRef = userDoc.data()?.liked || null;
      if (newRef == null || !newRef.includes(user.uid)) {
        // Add a new user to the "liked" array field if it isn't already in there
        await updateDoc(currentRef, {
          liked: arrayUnion(user.uid)
        });
      }
    }
    // jasons thing that works :D
    setCurrentIndex((prevIndex) => (prevIndex + 1) % users.length);
  }

  // if the current user hits the dislike button, we want to add them to the dislike pile
  const hitDislike = async () => {
    const user = users[currentIndex];
    const currentRef = doc(db, "users", currentUser.uid);
    // Atomically add a new user to the "disliked" array field.
    await updateDoc(currentRef, {
      disliked: arrayUnion(user.uid)
    });
    setCurrentIndex((prevIndex) => (prevIndex + 1) % users.length);
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  }

  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <script src="https://cdn.tailwindcss.com"></script>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My Dating App</title>
      </head>

      <body className="bg-gray-200 font-sans height-screen">
        <div id="navbar" className="bg-white shadow p-4">
          <h1 className="text-2xl font-semibold text-red-500 text-center">Fumble</h1>
          {/* <!-- Add icons for navigation --> */}
          <nav className="flex items-center justify-center mt-4">
            <a href="/" className="text-gray-w-900 hover:text-red-500 mx-2">Home</a>
            {/* <a href="#" className="text-gray-600 hover:text-red-500 mx-2">Matches</a> */}
            <a href="/chatsPage" className="text-gray-600 hover:text-red-500 mx-2">Messages</a>
            <a href="/updateprofile" className="text-gray-600 hover:text-red-500 mx-2">Profile</a>
            <a href="/communityguidelines" className="text-green-600 hover:text-red-500 mx-2">Commmunity Guidelines</a>
            <a onClick={handleSignOut} className="text-gray-600 hover:text-red-500 mx-2">Logout</a>
          </nav>
        </div>

        {/* <!-- Tinder-like card interface for user profiles --> */}
        <div className="flex justify-center max-w-1x1 my-28">
          <div className="bg-white shadow-lg rounded-lg p-6 w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 max-w-1x1">
            {/* <!-- Profile image --> */}
            <img id="img" src="./img/profile-photo-1.webp" alt="Profile Image" className="w-full h-40 object-cover rounded-full" />
            {/* <!-- User information --> */}
            <h2 id="name" className="text-xl font-semibold mb-2 self-center"></h2>
            <p id="age" className="text-gray-600"></p>
            <p id="location" className="text-gray-600"></p>
            <p id="major" className="text-gray-600 font-medium"></p>
            {/* <!-- Additional profile details --> */}
            <p id="bio" className="text-gray-700 mt-4"></p>
            {/* <!-- Like/Dislike buttons --> */}
            <div className="flex justify-between mt-6">
              <button onClick={hitLike} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Like</button>
              <button onClick={hitDislike} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Dislike</button>
            </div>
          </div>
        </div>

        <div id='heartStuff' hidden>
          <div id="heart" >
          </div>
          <p id='heartext'>Its a match!</p>
        </div>


        {/* <!-- Footer --> */}
        <div className="bg-gray-800 text-white p-4 text-center fixed bottom-0 left-0 right-0">
          &copy; Welcome to Fumble
        </div>



      </body>
    </html>




    // </html>
  )
}

export default Home