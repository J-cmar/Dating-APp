import React from 'react'
import { useState } from "react";
import Add from "../img/addAvatar.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const UpdateProfile = () => {
    const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const newBio = e.target.querySelector('input[name="bio"]').value;
    const newAge = e.target.querySelector('input[name="age"]').value;
    // const file = e.target[3].files[0];

    try {
      //Create user
      const user = auth.currentUser;
    

      //Create a unique image name
      // const date = new Date().getTime();
      // const storageRef = ref(storage, `${user.displayName + date}`);

      // await uploadBytesResumable(storageRef, file).then(() => {
      //   getDownloadURL(storageRef).then(async (downloadURL) => {
      //     try {

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        bio: newBio,
        age: newAge,
      });

      setLoading(false);
      navigate("/");

            // Optional: Redirect or navigate to another page
            
      
      //     } catch (err) {
      //       console.log(err);
      //       setErr(true);
      //       setLoading(false);
      //     }
      //   });
      // });
    } catch (err) {
      setErr(true);
      setLoading(false);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Please Update Profile</span>
        <form onSubmit={handleSubmit}>
          <input required name="bio" type="text" placeholder="Bio" />
          <input required name="age" type="number" min= "18" max="100" placeholder="Age" />
          {/* <input required style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file">
            <img src={Add} alt="" />
            <span>Add an avatar</span>
          </label> */}
          <button disabled={loading}>Sign up</button>
          {loading && "Uploading and compressing the image please wait..."}
          {err && <span>Something went wrong</span>}
        </form>
        <p>
          Lookin Good!
        </p>
      </div>
    </div>
  )
}

export default UpdateProfile