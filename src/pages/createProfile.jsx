import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import Add from "../img/addAvatar.png";
import unknown from '../img/blank-avatar.png';
import { db, storage } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

// import {Cropper} from "react-easy-crop";



const createProfile = () => {
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

  return (
    <>
      <div className="formContainerTwo">
        <div className="formWrapper">
          <span className="logo">Fumble</span>
          <span className="title">Create Profile</span>
          <form onSubmit={handleSubmit}>
            <input required
              style={{ display: "none" }}
              type="file"
              id="file"
              onChange={showPhoto}
            />
            <label htmlFor="file">
              <img src={Add} alt="" />
              <span className="label">This is the image people will see when clicking!</span>
            </label>
            <input required type="text" placeholder="Create your bio!" />
            <input required type="number" min="18" max="100" placeholder="Enter Age" />
            <input required type="text" placeholder="Enter Major" />
            <button disabled={loading}>Update Profile!</button>
            {loading && "Uploading and compressing the image please wait..."}
            {err && <span>Something went wrong</span>}
          </form>
          <p>Image may be cropped!</p>
        </div>
        <aside>
          <img src={unknown} height={250} id="userImage" />

        </aside>

      </div>
    </>
  )
}

export default createProfile