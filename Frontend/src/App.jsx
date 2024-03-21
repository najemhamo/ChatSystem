import './App.css'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { createContext } from 'react'
import LoginPage from './LoginPage'
import HomePage from './HomePage'

export const AuthContext = createContext();

const loadUserDataFromStorage = () => 
{
  const userVal = localStorage.getItem("authUser");
  if (userVal !== undefined || userVal !== null) return JSON.parse(userVal);
  return null;
};

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken") || "");
  const [user, setUser] = useState(loadUserDataFromStorage);
  const navigate = useNavigate()

  useEffect(() =>
  {
    if (!user)
      navigate("/login")

  }, [user, navigate])


  const login = (user, authToken) =>
  {
    setUser(user);
    setAuthToken(authToken);
    localStorage.setItem("authUser", JSON.stringify(user));
    localStorage.setItem("authToken", authToken);
    navigate("/");
  };

  const logout = () =>
  {
    setUser(null);
    setAuthToken("");
    localStorage.removeItem("authUser");
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <>
      <AuthContext.Provider value={{ user, authToken, login, logout }}>
        <Routes>
          <Route path="/login" element={<LoginPage/>} />
          <Route path='/*' element={<HomePage user={user} logout={logout}/>}/>
        </Routes>
      </AuthContext.Provider>
    </>
  )
}

export default App