import { useContext, useEffect, useState } from "react";
import { AuthContext, UserContext } from "./App";
import PropTypes from "prop-types";

const INITIAL_USER_REGISTER = {
  name: "",
  userName: "",
  email: "",
  password: "",
  aboutMe: "",
  profilePicture: "",
};

const INITIAL_USER = {
  userName: "",
  password: "",
};

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const { users } = useContext(UserContext);
  const [userForm, setUserForm] = useState(INITIAL_USER);
  const [userFormRegister, setUserFormRegister] = useState(
    INITIAL_USER_REGISTER
  );

  const [userLogin, setUserLogin] = useState({});
  const [userRegister, setUserRegister] = useState({});

  const [messageLogin, setMessageLogin] = useState("");
  const [messageRegister, setMessageRegister] = useState([]);

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

    fetch(`http://localhost:5007/Authentication/register`, postOptions).then(
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

  // Login
  useEffect(() => {
    if (!userLogin.userName) return;

    const postOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userLogin),
    };

    fetch(`http://localhost:5007/Authentication/login`, postOptions).then(
      (response) => {
        if (!response.ok)
          return response.text().then((text) => setMessageLogin(text));
        else
          return response.json().then((data) => {
            const tmpUser = users.filter(
              (user) => user.userName === data.userName
            )[0];

            console.log("DATA", data)
            login(tmpUser, data.token);
          });
      }
    );
  }, [userLogin]);

  // REGISTER
  const handleInputRegister = (event) => {
    const { name, value } = event.target;
    setUserFormRegister({ ...userFormRegister, [name]: value });
  };

  const handleClickRegister = () => {
    setUserRegister(userFormRegister);
  };

  // LOGIN
  const handleInput = (event) => {
    const { name, value } = event.target;
    setUserForm({ ...userForm, [name]: value });
  };

  const handleClick = () => {
    setUserLogin(userForm);
  };

  return (
    <>
      <div className="register">
        <h2 className="registerInputs registerH2">Register</h2>
        <input
          className="registerInputs"
          type="text"
          name="name"
          placeholder="Name"
          value={userFormRegister.name}
          onChange={handleInputRegister}
        ></input>
        <input
          className="registerInputs"
          type="text"
          name="userName"
          placeholder="UserName"
          value={userFormRegister.userName}
          onChange={handleInputRegister}
        ></input>
        <input
          className="registerInputs"
          type="text"
          name="email"
          placeholder="Email"
          value={userFormRegister.email}
          onChange={handleInputRegister}
        ></input>
        <input
          className="registerInputs"
          type="password"
          name="password"
          placeholder="Password"
          value={userFormRegister.password}
          onChange={handleInputRegister}
        ></input>
        {messageRegister.map((message, index) => (
          <p className="registerInputs" key={index}>
            {message.description}
          </p>
        ))}
        <button
          className="registerInputs registerBtn"
          onClick={handleClickRegister}
        >
          Register
        </button>
      </div>

      <div className="register">
        <h2 className="registerInputs loginH2">Login</h2>
        <div className="loginInput">
          <input
            className="registerInputs"
            type="text"
            name="userName"
            placeholder="UserName"
            value={userForm.userName}
            onChange={handleInput}
          ></input>
          <input
            className="registerInputs"
            type="password"
            name="password"
            placeholder="Password"
            value={userForm.password}
            onChange={handleInput}
          ></input>
          <p className="registerInputs">{messageLogin}</p>
        </div>
        <button className="registerInputs loginBth" onClick={handleClick}>
          Login
        </button>
      </div>
    </>
  );
}

LoginPage.propTypes = {
  users: PropTypes.array.isRequired,
};
