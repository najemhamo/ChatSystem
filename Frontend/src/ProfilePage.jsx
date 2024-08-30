import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext, UserContext } from "./App";
import { SocketContext } from "./HomePage";


export default function ProfilePage() {
  const { memberId } = useParams();
  const { user, setUser } = useContext(AuthContext);
  const { users, setUsers } = useContext(UserContext);
  const { socket } = useContext(SocketContext);
  const [buttonText, setButtonText] = useState("Edit");
  const [userProfile, setUserProfile] = useState({});
  const ownUserProfile = user && user.id === parseInt(memberId);

  // GET user by id
  useEffect(() => {
    fetch(`http://localhost:5007/chat/members/${memberId}`)
      .then((response) => response.json())
      .then((data) => setUserProfile(data));
  }, [memberId]);

  // Socket
  socket.onmessage = function (event) {
    const messageObj = JSON.parse(event.data);

    if (messageObj.type === "userUpdate") {
      const updatedUser = { ...messageObj.content };
      updateUsers({ updatedUser });
    }
  };

  const updateUsers = (data) => {
    const newUsers = users.map((usr) => {
      if (usr.id === data.updatedUser.id) return data.updatedUser;
      return usr;
    });

    setUsers(newUsers);
  }

  const handleEdit = () => {
    if (buttonText === "Save")
    {
      // Creates new user
      const userName = document.getElementById("userName").value    
      const name = document.getElementById("name").value    
      const aboutMe = document.getElementById("aboutMe").value
      const profilePicture = document.getElementById("profilePicture").value

      const updatedUser = userProfile
      let hasChanged = false

      if (userName.length > 0 && userName !== userProfile.userName)
      {
        hasChanged = true
        updatedUser.userName = userName;
      }
        
      if (name.length > 0 && name !== userProfile.name)
      {
        hasChanged = true
        updatedUser.name = name;
      }

      if (aboutMe.length > 0 && aboutMe !== userProfile.aboutMe)
      {
        hasChanged = true
        updatedUser.aboutMe = aboutMe;
      }
      if (profilePicture.length > 0 && profilePicture !== userProfile.profilePicture)
      {
        hasChanged = true
        updatedUser.profilePicture = profilePicture;
      }

      if (!hasChanged)
      {
        setButtonText("Edit")
        return
      }      
      updatedUser.id = userProfile.id;
      

      // Websocket edit user
      socket.send(JSON.stringify({ type: "userUpdate", content: updatedUser }));


      // UPDATE user information
      const putOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      };
    
      fetch(`http://localhost:5007/chat/members/${memberId}`, putOptions);
      updateUsers({ updatedUser });
      setUserProfile(updatedUser);
      setUser(updatedUser);
      localStorage.setItem("authUser", JSON.stringify(updatedUser));      
      setButtonText("Edit");
    } else setButtonText("Save");
  };

  return (
    <>
      <div className="profile">
        <h1>User Information</h1>
        <div className="">
          {buttonText === "Edit" && <p>Username: {userProfile.userName}</p>}
          {buttonText === "Edit" && <p>Name: {userProfile.name}</p>}
          {buttonText === "Edit" && <p>About me: {userProfile.aboutMe}</p>}
        </div>

        {buttonText === "Save" &&
        <>
          <input
            id="userName"
            name="userName"
            type="text"
            defaultValue={userProfile.userName}
          ></input>

          <input
            id="name"
            name="name"
            type="text"
            defaultValue={userProfile.name === "" ? "Name" : userProfile.name}
          ></input>

          <input
            id="aboutMe"
            name="aboutMe"
            type="text"
            defaultValue={
              userProfile.aboutMe === "" ? "AboutMe" : userProfile.aboutMe
            }
          ></input>

          <input
            id="profilePicture"
            name="profilePicture"
            type="text"
            defaultValue={
              userProfile.profilePicture === ""
                ? "PictureLink"
                : userProfile.profilePicture
            }
          ></input>
        </>
        }

        <div className="userImage">
          <img
            src={userProfile.profilePicture}
          ></img>
        </div>

      </div>
      <div>
        {ownUserProfile && (
          <button className="profileEdit" onClick={handleEdit}>
            {buttonText === "Edit" && <i className="fa fa-bars"></i>}
            {buttonText === "Save" && <i>&#10003;</i>}
          </button>
          )}
      </div>
    </>
  );
}
