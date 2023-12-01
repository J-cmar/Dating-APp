import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import Add from "../img/addAvatar.png";
import { db, storage } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";


const UpdateProfile = () => {
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




  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Fumble</span>
        <span className="logo">Please Update Profile</span>
        <form onSubmit={handleSubmit}>
          <input required style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file">
            <img src={Add} alt="" />
            <span>Add an Photo</span>
          </label>
          <input required type="text" placeholder="Create a bio" />
          <input required type="number" min="18" max="100" placeholder="Enter Age" />
          <input required type="text" placeholder="Enter Major" />
          <button disabled={loading}>Update Profile!</button>
          {loading && "Uploading and compressing the image please wait..."}
          {err && <span>Something went wrong</span>}
        </form>
        <p>Do later? <Link to="/">Start Viewing!</Link></p>
      </div>
    </div>
  )
}

export default UpdateProfile