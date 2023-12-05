import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import Add from "../img/addAvatar.png";
import unknown from '../img/blank-avatar.png';
import { db, storage } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

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

  return (
    <>
      <div id="navbar" class="bg-white shadow p-4 w-full">
        <h1 class="text-2xl font-semibold text-red-500 text-center">Fumble</h1>
        {/* <!-- Add icons for navigation --> */}
        <nav class="flex items-center justify-center mt-4">
          <a href="/" class="text-gray-600 hover:text-red-500 mx-2">Home</a>
          {/* <a href="#" class="text-gray-600 hover:text-red-500 mx-2">Matches</a> */}
          <a href="/chatsPage" class="text-gray-w-900 hover:text-red-500 mx-2">Messages</a>
          <a href="/updateprofile" class="text-gray-600 hover:text-red-500 mx-2">Profile</a>
          <a href="Community_Guidelines.html" class="text-green-600 hover:text-red-500 mx-2">Commmunity Guidelines</a>
          <a onClick={handleSignOut} href="/login" class="text-gray-600 hover:text-red-500 mx-2">Logout</a>
        </nav>
      </div>
      <div className="formContainer">

        <div className="formWrapper">
          <span className="logo">Fumble</span>
          <span className="title">Update Profile</span>
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
          <p>Do later? <Link to="/">Start Viewing!</Link></p>
        </div>
        <aside>
          <img src={unknown} height={250} id="userImage" />

        </aside>

      </div>
    </>
  )
}

export default UpdateProfile