import { useState } from 'react';
import { collection, doc, setDoc,getDoc, query, where, onSnapshot, getFirestore, getDocs } from "firebase/firestore";
import { db, storage, auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { async } from '@firebase/util';
import { useContext, useEffect } from 'react';
import account from '../img/blank-avatar.png'
import {useNavigate} from "react-router-dom"

const getUserLocation = async (uid) =>{

    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
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

const Home = () => {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [location, setLocation] = useState(null);


  const { currentUser } = useContext(AuthContext);

  if(currentUser == null){
    const navigate = useNavigate();
    navigate("/")
  }else{
    console.log('not null')
  }
  useEffect(() => {
    const fetchData = async () => {
      const userLocation = await getUserLocation(currentUser.uid);
      setLocation(userLocation);

      if (userLocation) {
        const usersInLocation = await returnUsers(userLocation, currentUser.uid);
        setUsers(usersInLocation);
      }
    };

    fetchData();
  }, [currentUser.uid]);

  useEffect(() => {
    // Update UI based on the current user
    const currentUser = users[currentIndex];
    if (currentUser) {
      document.getElementById("img").src = currentUser.viewPhotoURL || account;
      document.getElementById("name").textContent = "Name: " + currentUser.displayName || '';
      document.getElementById("age").textContent = "Age: "+currentUser.age || '';
      document.getElementById("bio").textContent = "Bio: "+currentUser.bio || '';
      document.getElementById("location").textContent = "Location: "+currentUser.location || '';
    }
  }, [users, currentIndex]);
  
  const nextUser = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % users.length);
  };

  return (
    // {changeUser}
    <div className='home'>
      <div className="container">
        <h1>this is the new home</h1>
        <h1>WELCOME TO FUMBLE</h1>
        <br/>
        <br/>
        <hr/>
        <div>
          <img id="img" alt="" src={account} height={100}/>
        <p id="name"></p>
        <p id="age"></p>
        <p id="bio"></p>
        <p id="location"></p>

        
        <button onClick={nextUser}>Like</button>
        <button onClick={nextUser}>Dislike</button>
        </div>
        
        </div>
    </div>
  )
}

export default Home