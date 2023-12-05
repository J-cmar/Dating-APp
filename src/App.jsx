import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChatPage from "./pages/ChatPages";
import UpdateProfile from "./pages/UpdateProfile";
import "./style.scss";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import CreateProfile from "./pages/createProfile";

function App() {
  const { currentUser } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route
            index
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="chatspage" element={<ChatPage />} />
          <Route path="updateprofile" element={<UpdateProfile />} />
          <Route path="createprofile" element={<CreateProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
