import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const INITIAL_USER_REGISTER = {
  name: "",
  userName: "",
  email: "",
  password: "",
  aboutMe: "",
  profilePicture: "",
};

export default function RegisterPage()
{
    const navigate = useNavigate()
    const [userRegister, setUserRegister] = useState({});
    const [messageRegister, setMessageRegister] = useState([]);
    const [userFormRegister, setUserFormRegister] = useState(INITIAL_USER_REGISTER);

    // Register
    useEffect(() => {
        if (!userRegister.userName) return;

        const postOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userRegister),
        };

        fetch(`http://localhost:5007/Authentication/registerMember`, postOptions).then(
        (response) => {
            if (!response.ok)
            return response
                .text()
                .then((text) => setMessageRegister(JSON.parse(text)));
            else
            return response.json().then(() => {
                setMessageRegister([{ description: "Register sucessfull!" }]);
            });
        }
        );
  }, [userRegister]);

    // REGISTER
    const handleInputRegister = (event) => {
        const { name, value } = event.target;
        setUserFormRegister({ ...userFormRegister, [name]: value });
    };

    const handleClickRegister = () => {
        setUserRegister(userFormRegister);
    };



    return (<>
    <div className="login">
        <h2 className="">Register</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={userFormRegister.name}
          onChange={handleInputRegister}
        ></input>
        <input
          type="text"
          name="userName"
          placeholder="UserName"
          value={userFormRegister.userName}
          onChange={handleInputRegister}
        ></input>
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={userFormRegister.email}
          onChange={handleInputRegister}
        ></input>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={userFormRegister.password}
          onChange={handleInputRegister}
        ></input>
        {messageRegister.map((message, index) => (
          <p key={index}>
            {message.description}
          </p>
        ))}
        <button
          onClick={handleClickRegister}
        >
          Register
        </button>
        <button
          className="registerBtn"
          onClick={() => navigate("/login")}
        >
          Back to Login
        </button>
      </div>
    </>)
}