import { useContext, useEffect, useState } from "react";
import { AuthContext, UserContext } from "./App";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const INITIAL_USER = {
  userName: "",
  password: "",
};

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const { users } = useContext(UserContext);

  const navigate = useNavigate()
  const [userLogin, setUserLogin] = useState({});
  const [messageLogin, setMessageLogin] = useState("");
  const [userForm, setUserForm] = useState(INITIAL_USER);

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

            console.log("DATA", tmpUser)
            tmpUser.password = undefined
            login(tmpUser, data.token);
          });
      }
    );
  }, [userLogin]);

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
      <div className="login">
        <h2>Login</h2>
        <input
          type="text"
          name="userName"
          placeholder="UserName"
          value={userForm.userName}
          onChange={handleInput}
        ></input>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={userForm.password}
          onChange={handleInput}
        ></input>
        <p>{messageLogin}</p>
        <button onClick={handleClick}>
          Login
        </button>
        <button className="registerBtn" onClick={() => navigate("/register")}>
          Not a user? Register
        </button>
      </div>
    </>
  );
}

LoginPage.propTypes = {
  users: PropTypes.array,
};
