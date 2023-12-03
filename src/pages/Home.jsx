import React from 'react'
import { collection, doc, setDoc, query, where, onSnapshot } from "firebase/firestore";
import { db, storage } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const [usersAround, setUsers] = useState([]);
  const { currentUser } = useContext(AuthContext);
  let totalLength;
  let userToGrab = 0;
  let otherUser;

  let usersRef = db.collection("users");

  // should grab an array of users within the current user's area
  onSnapshot(usersRef, (anotherUserRef) => {
    anotherUserRef.where("location", "==", currentUser.location);
    let users = [];
    anotherUserRef.docs.forEach((doc) => {
      if (doc.location == currentUser.location) {
        users.push({ ...doc.data(), uid: doc.uid })
      }
    })
    setUsers(users);
    totalLength = usersAround.length;
  })

  // we need to grab a user, check if it is in the same area as our current user, and once a match is found
  // output the photo of this new user with thier bio onto the screen. 
  useEffect(() => {
    changeUserView();
  })

  const setUserArr = async (e) => {
    setUsers(await getDocs(e));
  }

  const hitLike = () => {

  }

  const hitDislike = () => {

  }


  const changeUserView = () => {
    otherUser = usersAround[userToGrab];
    userToGrab++;
    document.getElementById("img").src = otherUser.viewPhotoURL;
    document.getElementById("name").innerHTML = otherUser.displayName;
    document.getElementById("bio").innerHTML = otherUser.bio;
  }

  // const checkArea = () => {

  // }

  // const checkAlreadySeen = () => {

  // }

  return (
    <div className='home'>
      <div className="container">
        <h1>this is the new home</h1>
        <h1>WELCOME TO FUMBLE</h1>
        <button onClick={hitLike}>Like</button>
        <button onClick={hitDislike}>Dislike</button>
        <img id="img" alt="" />
        <p id="name"></p>
        <p id="bio"></p>
      </div>
    </div>
  )
}

export default Home