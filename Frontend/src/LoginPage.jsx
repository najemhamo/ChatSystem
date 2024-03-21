import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./App";

const INITIAL_USER_REGISTER =
{
    name: "",
    userName: "",
    email: "",
    password: "",
    aboutMe: "",
    profilePicture: ""
}

const INITIAL_USER =
{
  userName: "",
  password: "",
}

export default function LoginPage() {

  const { login } = useContext(AuthContext)
  const [userForm, setUserForm] = useState(INITIAL_USER)
  const [userFormRegister, setUserFormRegister] = useState(INITIAL_USER_REGISTER)

  const [userLogin, setUserLogin] = useState({})
  const [userRegister, setUserRegister] = useState({})

  const [messageLogin, setMessageLogin] = useState([])
  const [messageRegister, setMessageRegister] = useState([])

  // Register
  useEffect(() =>
  {
    if (!userRegister.userName)
    return
   
    const postOptions =
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userRegister)
    }
        
    fetch(`http://localhost:5007/Authentication/register`, postOptions)
    .then(response => 
    {
        if (!response.ok) return response.text().then(text => setMessageRegister(JSON.parse(text)))
        else return response.json().then((data) =>
        {
          setMessageRegister([{description: "Register sucessfull!"}])
          console.log("DATA", data)
        })
    })
  }, [userRegister])

  // Login
  useEffect(() =>
  {
    if (!userLogin.userName)
    return
   
    const postOptions =
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userLogin)
    }
        
    fetch(`http://localhost:5007/Authentication/login`, postOptions)
    .then(response => 
    {
        if (!response.ok) return response.text().then(text => setMessageLogin(JSON.parse(text)))
        else return response.json().then((data) =>
        {
            login(data, data.token)
            console.log("DATA", data)
        })
    })
  }, [userLogin])

  // REGISTER
  const handleInputRegister = (event) =>
  {
    const { name, value } = event.target;
    setUserFormRegister({...userFormRegister, [name]: value});
  };

  const handleClickRegister = () =>
  {
    setUserRegister(userFormRegister)
  }

  // LOGIN
  const handleInput = (event) =>
  {
    const { name, value } = event.target;
    setUserForm({...userForm, [name]: value});
  };

  const handleClick = () =>
  {
    setUserLogin(userForm)
  }

  return (
    <>
        <h2>Register</h2>
        <input type="text" name="name" placeholder="name" value={userFormRegister.name} onChange={handleInputRegister}></input>
        <input type="text" name="userName" placeholder="userName" value={userFormRegister.userName} onChange={handleInputRegister}></input>
        <input type="text" name="email" placeholder="email" value={userFormRegister.email} onChange={handleInputRegister}></input>
        <input type="password" name="password" placeholder="password" value={userFormRegister.password} onChange={handleInputRegister}></input>
        {messageRegister.map((message, index) => (<p key={index}>{message.description}</p>))}
        <button onClick={handleClickRegister}>Register</button>

        <h2>Login</h2>
        <input type="text" name="userName" placeholder="userName" value={userForm.userName} onChange={handleInput}></input>
        <input type="password" name="password" placeholder="password" value={userForm.password} onChange={handleInput}></input>
        {messageLogin.map((message, index) => (<p key={index}>{message.description}</p>))}
        <button onClick={handleClick}>Login</button>
    </>
  );
}