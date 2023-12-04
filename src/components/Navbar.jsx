import React, { useContext } from 'react'
import { signOut } from "firebase/auth"
import { auth } from '../firebase'
import { AuthContext } from '../context/AuthContext'
import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className='navbar'>
      <span className="logo">Fumble</span>
      <div className="user">
        <img src={currentUser.photoURL} alt="" />
        <span>{currentUser.displayName}</span>
      </div>
    </div>
  )
}

export default Navbar