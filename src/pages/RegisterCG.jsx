import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const RegisterCG = () => {
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    if (currentUser == null) {
        navigate("/login")
    }

    const agreed = () => {
        navigate("/");
    }

    return (
        <html lang="en">
            {/* AED5A6 */}
            <body className="bg-cover bg-center">
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
                            <button onClick={agreed} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                I Agree with These Policies
                            </button>
                        </div>



                    </div>

                </div>
            </body>
        </html>
    )
}

export default RegisterCG