import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Add from "../img/addAvatar.png";
import unknown from '../img/blank-avatar.png';
import { db, storage } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc } from "firebase/firestore";

// import {Cropper} from "react-easy-crop";

const UpdateProfile = () => {
  //   const [image, setImage] = useState(null);
  // const [crop, setCrop] = useState({ x: 0, y: 0 });
  // const [zoom, setZoom] = useState(1);
  // const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  // const imgRef = useRef(null);
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  let displayName;
  let photoURL;
  let age;
  let bio;
  let location;

  useEffect(() => {
    setData(currentUser.uid);
  });

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const file = e.target[0].files[0];
    const bio = e.target[1].value;
    const age = e.target[2].value;
    const major = e.target[3].value;
    try {
      const storageRef = ref(storage, `${currentUser.displayName + currentUser.uid}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            await setDoc(doc(db, 'users', currentUser.uid), {
              viewPhotoURL: downloadURL,
              bio,
              age,
              major
            }, { merge: true });
            navigate("/")
          } catch (err) {
            console.log(err);
            setErr(true);
            setLoading(false);
          }
        });
      });
    } catch (err) {
      setErr(true);
      setLoading(false);
    }
  };

  const showPhoto = (e) => {
    const userProfImg = document.getElementById("userImage");
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        userProfImg.src = e.target.result;
        userProfImg.hidden = false;
      };
      reader.readAsDataURL(file);
    }
    console.log("went through")
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  }

  const setData = async (uid) => {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    console.log("one way: " + currentUser.uid);
    console.log("another: " + userDoc.data().uid);
    displayName = userDoc.data()?.displayName || null;
    age = userDoc.data()?.age || null;
    bio = userDoc.data()?.bio || null;
    location = userDoc.data()?.location || null;
    photoURL = userDoc.data()?.viewPhotoURL || null;
    document.getElementById("img").src = photoURL || account;
    document.getElementById("name").textContent = displayName || '';
    document.getElementById("age").textContent = age + ", Cal Poly Pomona" || '';
    document.getElementById("bio").textContent = bio || '';
    document.getElementById("location").textContent = location + ", CA" || '';
  }

  const hitLike = async () => {

  }

  // if the current user hits the dislike button, we want to add them to the dislike pile
  const hitDislike = async () => {

  }

  return (
    <>
      <div id="navbar" className="bg-white shadow p-4 w-full">
        <h1 className="text-2xl font-semibold text-red-500 text-center">Fumble</h1>
        {/* <!-- Add icons for navigation --> */}
        <nav class="flex items-center justify-center mt-4">
          <a href="/" class="text-gray-600 hover:text-red-500 mx-2">Home</a>
          {/* <a href="#" class="text-gray-600 hover:text-red-500 mx-2">Matches</a> */}
          <a href="/chatsPage" class="text-gray-600 hover:text-red-500 mx-2">Messages</a>
          <a href="/updateprofile" class="text-gray-w-900 hover:text-red-500 mx-2">Profile</a>
          <a href="communityguidelines" class="text-green-600 hover:text-red-500 mx-2">Commmunity Guidelines</a>
          <a onClick={handleSignOut} href="/login" class="text-gray-600 hover:text-red-500 mx-2">Logout</a>
        </nav>
      </div>

      <div className="formContainer">
        <div className="formWrapper">
          <span className="logo">Update Profile</span>
          <form onSubmit={handleSubmit}>
            <input required
              style={{ display: "none" }}
              type="file"
              id="file"
              onChange={showPhoto}
            />
            <label htmlFor="file">
              <img src={Add} alt="" />
              <span className="label">Update Profile Picture</span>
            </label>
            <input required type="text" placeholder="Update your bio" />
            <input required type="number" min="18" max="100" placeholder="Enter New Age" />
            <input required type="text" placeholder="Change Major" />
            <button disabled={loading}>Update Profile!</button>
            {loading && "Uploading and compressing the image please wait..."}
            {err && <span>Something went wrong</span>}
          </form>
          <p>Image may be cropped!</p>
        </div>
        <aside className="w-1/3 ml-10">
          <h1 className="text-center">This is what your profile looks like!</h1>
          <div className="flex justify-center w-full">
            <div className="bg-white shadow-lg rounded-lg p-6 w-11/12">
              {/* <!-- Profile image --> */}
              <img id="img" src="./img/profile-photo-1.webp" alt="Profile Image" className="w-full h-40 object-cover rounded-full" />
              {/* <!-- User information --> */}
              <h2 id="name" className="text-xl font-semibold mb-2 self-center"></h2>
              <p id="age" className="text-gray-600"></p>
              <p id="location" className="text-gray-600"></p>
              {/* <!-- Additional profile details --> */}
              <p id="bio" className="text-gray-700 mt-4"></p>
              {/* <!-- Like/Dislike buttons --> */}
              <div className="flex justify-between mt-6">
                <button onClick={hitLike} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Like</button>
                <button onClick={hitDislike} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Dislike</button>
              </div>
            </div>
          </div>

        </aside>
      </div>
    </>
  )
}

export default UpdateProfile