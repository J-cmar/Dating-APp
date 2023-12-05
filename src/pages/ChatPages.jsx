import { React, useContext } from 'react'
import Sidebar from '../components/Sidebar'
import Chat from '../components/Chat'
import { auth } from '../firebase'
import { signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ChatPage = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  if (currentUser == null) {
    navigate("/login")
  } else {
    // console.log('not null')
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
    <div className='home'>
      <div id="navbar" className="bg-white shadow p-4 w-full">
        <h1 className="text-2xl font-semibold text-red-500 text-center">Fumble</h1>
        {/* <!-- Add icons for navigation --> */}
        <nav className="flex items-center justify-center mt-4">
          <a href="/" className="text-gray-600 hover:text-red-500 mx-2">Home</a>
          {/* <a href="#" className="text-gray-600 hover:text-red-500 mx-2">Matches</a> */}
          <a href="/chatsPage" className="text-gray-w-900 hover:text-red-500 mx-2">Messages</a>
          <a href="/updateprofile" className="text-gray-600 hover:text-red-500 mx-2">Profile</a>
          <a href="/communityguidelines" className="text-green-600 hover:text-red-500 mx-2">Commmunity Guidelines</a>
          <a onClick={handleSignOut} href="/login" className="text-gray-600 hover:text-red-500 mx-2">Logout</a>
        </nav>
      </div>
      <div className="container">
        <Sidebar />
        <Chat />
      </div>
    </div>
  )
}

export default ChatPage