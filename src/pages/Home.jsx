import { useState } from 'react';
import { collection, doc, setDoc, getDoc, query, where, serverTimestamp, getDocs, updateDoc, arrayUnion } from "firebase/firestore";
import { db, storage, auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { async } from '@firebase/util';
import { useContext, useEffect } from 'react';
import account from '../img/blank-avatar.png'
import { useNavigate } from "react-router-dom"

// grabs the user location
const getUserLocation = async (uid) => {
  const userRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userRef);
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
  const [likedCurrent, setCurrentLiked] = useState([]);
  const navigate = useNavigate();

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
      document.getElementById("name").textContent = "Name: " + currentUserViewed.displayName || '';
      document.getElementById("age").textContent = "Age: " + currentUserViewed.age || '';
      document.getElementById("bio").textContent = "Bio: " + currentUserViewed.bio || '';
      document.getElementById("location").textContent = "Location: " + currentUserViewed.location || '';
    }
  }

  const hitLike = async () => {
    // grab the user that they are currently viewing
    const user = users[currentIndex];
    const userLiked = await getUserLiked(user.uid);
    const userDisliked = await getUserDisliked(user.uid);

    // see if this person has like the current user before
    if (userLiked != null && userLiked.includes(currentUser.uid)) {
      console.log("gets in there");
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
      } catch (err) { }
    } else if (userDisliked != null && userDisliked.includes(currentUser.uid)) {
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
    navigate("/chatsPage");
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

  return (
    // {changeUser}
    <div className='home'>
      <div className="container">
        <h1 className='title'>WELCOME TO FUMBLE</h1>
        <br />
        <br />
        <hr />
          <div className='user-info'>
            <img id="img" alt="" src={account} height={100} />
            <p id="name"></p>
            <p id="age"></p>
            <p id="bio"></p>
            <p id="location"></p>
            <div className='buttons'>
              <button onClick={hitLike}>Like</button>
              <button onClick={hitDislike}>Dislike</button>
            </div>


          <p id = "noOneTag"hidden>Sorry there's no one else here <br/>&#129335;</p>
        </div>

      </div>
    </div>
  )
}

export default Home