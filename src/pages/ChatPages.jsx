import React from 'react'
import Sidebar from '../components/Sidebar'
import Chat from '../components/Chat'

const ChatPage = () => {
  return (
    <div className='home'>
      <div id="navbar" class="bg-white shadow p-4 w-full">
        <h1 class="text-2xl font-semibold text-red-500 text-center">Fumble</h1>
        {/* <!-- Add icons for navigation --> */}
        <nav class="flex items-center justify-center mt-4">
          <a href="/" class="text-gray-600 hover:text-red-500 mx-2">Home</a>
          <a href="#" class="text-gray-600 hover:text-red-500 mx-2">Matches</a>
          <a href="/chatsPage" class="text-gray-w-900 hover:text-red-500 mx-2">Messages</a>
          <a href="#" class="text-gray-600 hover:text-red-500 mx-2">Profile</a>
          <a href="Community_Guidelines.html" class="text-green-600 hover:text-red-500 mx-2">Commmunity Guidelines</a>
          <a href="/login" class="text-gray-600 hover:text-red-500 mx-2">Logout</a>
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