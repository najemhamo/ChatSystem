import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "./App";
import PropTypes from "prop-types";

export default function ProfilePage(props) {
  const { socket, updateUsers, updateChannel, deleteChannel } = props;
  const { memberId } = useParams();
  const { user } = useContext(AuthContext);
  const [buttonText, setButtonText] = useState("Edit");

  const INITIAL_USER = {
    userName: "",
    name: "",
    aboutMe: "",
  };
  const [newUser, setNewUser] = useState(INITIAL_USER);
  const [updateUser, setUpdateUser] = useState({});
  const [userProfile, setUser] = useState({});
  const ownUserProfile = user[0] && user[0].id === parseInt(memberId);

  // GET user by id
  useEffect(() => {
    fetch(`http://localhost:5007/chat/members/${memberId}`)
      .then((response) => response.json())
      .then((data) => setUser(data));
  }, [memberId]);

  // PUT new user
  useEffect(() => {
    if (!updateUser.userName) return;

    socket.send(JSON.stringify({ type: "userUpdate", content: updateUser }));

    const putOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateUser),
    };

    fetch(`http://localhost:5007/chat/members/${memberId}`, putOptions);
  }, [updateUser]);

  // Socket
  socket.onmessage = function (event) {
    const messageObj = JSON.parse(event.data);
    console.log("PROFILE PAGE SOCKET");

    if (messageObj.type === "userUpdate") {
      const updatedUser = { ...messageObj.content };
      updateUsers({ updatedUser });
    }

    if (messageObj.type === "channelUpdate") {
      const updatedChannel = {
        name: messageObj.content,
        id: messageObj.id,
      };
      updateChannel({ updatedChannel });
    } else if (messageObj.type === "channelDelete") {
      deleteChannel({ id: messageObj.id });
    }
  };

  const handleClick = () => {
    if (buttonText === "Save") {
      const updatedUser = newUser;

      if (updatedUser.userName.length === 0)
        updatedUser.userName = userProfile.userName;

      if (updatedUser.name.length === 0) updatedUser.name = userProfile.name;

      if (updatedUser.aboutMe.length === 0)
        updatedUser.aboutMe = userProfile.aboutMe;

      updatedUser.profilePicture = userProfile.profilePicture;
      updatedUser.id = userProfile.id;

      setUpdateUser(updatedUser);
      updateUsers({ updatedUser });
      setUser(updatedUser);
      setNewUser(INITIAL_USER);
      setButtonText("Edit");
    } else setButtonText("Save");
  };

  const handleInput = (event) => {
    const { name, value } = event.target;
    const tmpUser = { ...newUser, [name]: value };
    setNewUser(tmpUser);
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      ></link>

      <h1>User Information</h1>
      {buttonText === "Edit" && <p>{userProfile.userName}</p>}
      {buttonText === "Edit" && <p>{userProfile.name}</p>}
      {buttonText === "Edit" && <p>{userProfile.aboutMe}</p>}

      <div className="profile">
        {buttonText === "Save" && (
          <input
            className="profileInputs profileInputsWrite"
            name="userName"
            type="text"
            onChange={handleInput}
            placeholder={userProfile.userName}
            value={newUser.userName}
          ></input>
        )}
        {buttonText === "Save" && (
          <input
            className="profileInputs profileInputsWrite"
            name="name"
            type="text"
            onChange={handleInput}
            placeholder={userProfile.name}
            value={newUser.name}
          ></input>
        )}
        {buttonText === "Save" && (
          <input
            className="profileInputs profileInputsWrite"
            name="aboutMe"
            type="text"
            onChange={handleInput}
            placeholder={userProfile.aboutMe}
            value={newUser.aboutMe}
          ></input>
        )}
        <img
          className="profileInputs"
          src={userProfile.profilePicture}
          width={380}
          height={300}
        ></img>
      </div>

      <div>
        {ownUserProfile && (
          <button onClick={handleClick}>
            <i className="fa fa-bars"></i> {buttonText}
          </button>
        )}
      </div>
    </>
  );
}

ProfilePage.propTypes = {
  socket: PropTypes.object.isRequired,
  updateUsers: PropTypes.func.isRequired,
  updateChannel: PropTypes.func.isRequired,
  deleteChannel: PropTypes.func.isRequired,
};
