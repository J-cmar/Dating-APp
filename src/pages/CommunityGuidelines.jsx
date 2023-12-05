import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { signOut } from "firebase/auth"

const CommunityGuidelines = () => {
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    if (currentUser == null) {
        navigate("/login")
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
        <div>
            <div id="navbar" className="bg-white shadow p-4">
                <h1 className="text-2xl font-semibold text-red-500 text-center">Fumble</h1>
                {/* <!-- Add icons for navigation --> */}
                <nav className="flex items-center justify-center mt-4">
                    <a href="" className="text-gray-w-900 hover:text-red-500 mx-2">Home</a>
                    {/* <a href="#" className="text-gray-600 hover:text-red-500 mx-2">Matches</a> */}
                    <a href="/chatsPage" className="text-gray-600 hover:text-red-500 mx-2">Messages</a>
                    <a href="/updateprofile" className="text-gray-600 hover:text-red-500 mx-2">Profile</a>
                    <a href="/communityguidelines" className="text-green-600 hover:text-red-500 mx-2">Commmunity Guidelines</a>
                    <a onClick={handleSignOut} className="text-gray-600 hover:text-red-500 mx-2">Logout</a>
                </nav>
            </div>
            {/* style="background-image: url('your-background-image.jpg')" */}

            <body className="overflow-hidden h-[75vh] w-screen bg-cover bg-center flex flex-col place-content-center">
                <div className="flex items-center justify-center h-screen">
                    <div className="w-full max-w-xl bg-EAA8A8 bg-opacity-75 rounded p-8">

                        <div id="community-guidelines" className="container mx-auto my-10 bg-white p-8 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-semibold mb-4">Community Guidelines</h2>

                            <p className="mb-4">
                                <strong>1. Respectful Communication: </strong>
                                We encourage open and respectful communication. Be mindful of your language, tone, and ensure your interactions contribute positively to the community.
                            </p>

                            <p className="mb-4">
                                <strong>2. Inclusive Environment: </strong>
                                Our community welcomes individuals from diverse backgrounds, experiences, and perspectives. Treat everyone with kindness and inclusivity, fostering an environment where all members feel valued.
                            </p>

                            <p className="mb-4">
                                <strong>3. No Tolerance For Discrimination: </strong>
                                No form of harassment, discrimination, or bullying is tolerated. Any users found guilty will be banned.
                            </p>


                            <a href="index.html" className="block text-center" />
                        </div>
                    </div>

                </div>
                <div className="bg-gray-950 text-white p-4 text-center fixed bottom-0 left-0 right-0">
                    <p>CS-2250 Final</p>
                </div>
            </body>

        </div>
    )
}

export default CommunityGuidelines