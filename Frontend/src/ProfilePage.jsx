import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "./App";
import { SocketContext } from "./HomePage";

export default function ProfilePage(props) {
  const { updateUsers } = props;
  const { memberId } = useParams();
  const { user, setUser } = useContext(AuthContext);
  const { socket, updateChannel, deleteChannel } = useContext(SocketContext);
  const [buttonText, setButtonText] = useState("Edit");

  const INITIAL_USER = {
    name: "",
    userName: "",
    aboutMe: "",
    profilePicture: "",
  };
  const [newUser, setNewUser] = useState(INITIAL_USER);
  const [updateUser, setUpdateUser] = useState({});
  const [userProfile, setUserProfile] = useState({});
  const ownUserProfile = user && user.id === parseInt(memberId);

  // GET user by id
  useEffect(() => {
    fetch(`http://localhost:5007/chat/members/${memberId}`)
      .then((response) => response.json())
      .then((data) => setUserProfile(data));
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

      if (updatedUser.profilePicture.length === 0)
        updatedUser.profilePicture = userProfile.profilePicture;

      updatedUser.id = userProfile.id;

      setUpdateUser(updatedUser);
      updateUsers({ updatedUser });
      setUserProfile(updatedUser);
      setUser(updatedUser);
      localStorage.setItem("authUser", JSON.stringify(updatedUser));
      
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
      <div className="profileInfo">
      {buttonText === "Edit" && <p>Username: {userProfile.userName}</p>}
      {buttonText === "Edit" && <p>Name: {userProfile.name}</p>}
      {buttonText === "Edit" && <p>About me: {userProfile.aboutMe}</p>}
      </div>

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
            placeholder={userProfile.name === "" ? "Name" : userProfile.name}
            value={newUser.name}
          ></input>
        )}
        {buttonText === "Save" && (
          <input
            className="profileInputs profileInputsWrite"
            name="aboutMe"
            type="text"
            onChange={handleInput}
            placeholder={
              userProfile.aboutMe === "" ? "AboutMe" : userProfile.aboutMe
            }
            value={newUser.aboutMe}
          ></input>
        )}
        {buttonText === "Save" && (
          <input
            className="profileInputs profileInputsWrite"
            name="profilePicture"
            type="text"
            onChange={handleInput}
            placeholder={
              userProfile.profilePicture === ""
                ? "PictureLink"
                : userProfile.profilePicture
            }
            value={newUser.profilePicture}
          ></input>
        )}

        <img
          className="profileInputs profileImage"
          src={userProfile.profilePicture}
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
