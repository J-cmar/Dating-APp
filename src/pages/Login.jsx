import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import "./Login.scss";

const Login = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/")
    } catch (err) {
      setErr(true);
    }
  };
  return (
    
    <div className="formContainer">
      <div className="header">
        <h1> Fumble </h1> 
      <div className="AboutInfo">
       <h2>
        Welcome to Fumble: A Dating App where CPP Students can meet those
        with similar interests <br /> and interact with each other. 
       </h2> 
      </div>
      </div>
       <div className="formWrapper">
          <span className="title">Login</span>
          <form onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="email" />
            <input type="password" name="password" placeholder="password" />
            <button>Sign in</button>
           {err && <span>Something went wrong</span>}
         </form>
         <p>You don't have an account? <Link className="text-red-500 hover:text-red-700" to="/register">Register</Link></p>
        </div>
       </div>
  );
};

export default Login;
