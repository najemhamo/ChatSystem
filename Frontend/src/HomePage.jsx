import { createContext, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./App";
import ChannelPage from "./ChannelPage";
import ProfilePage from "./ProfilePage";
import HomeSocketPage from "./HomeSocketPage";
import ChannelItem from "./Components/ChannelItem";
import PropTypes from "prop-types";

export const UserContext = createContext();
export const SocketContext = createContext();

export default function HomePage(props) {
  const { users, setUsers } = props;
  const [socket] = useState(new WebSocket("ws://localhost:5007/chat"));
  const [channels, setChannels] = useState([]);
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  // GET channels
  useEffect(() => {
    fetch("http://localhost:5007/chat/channels")
      .then((response) => response.json())
      .then((data) => setChannels(data));
  }, []);

  // USERS
  const updateUsers = (data) => {
    const newUsers = users.map((usr) => {
      if (usr.id === data.updatedUser.id) return data.updatedUser;
      return usr;
    });

    setUsers(newUsers);
  };

  // CHANNELS
  const updateChannel = (data) => {
    if (channels.length === 0) {
      setChannels((channelList) =>
        channelList.map((chn) => {
          if (chn.id === data.updatedChannel.id) return data.updatedChannel;
          return chn;
        })
      );
    } else {
      const tmpChannels = channels.map((chn) => {
        if (chn.id === data.updatedChannel.id) return data.updatedChannel;
        return chn;
      });

      setChannels(tmpChannels);
    }
  };

  const deleteChannel = (data) => {
    if (channels.length === 0)
      setChannels((channelList) =>
        channelList.filter((chn) => {
          return chn.id !== data.id;
        })
      );
    else {
      const tmpChannels = channels.filter((chn) => {
        return chn.id !== data.id;
      });
      setChannels(tmpChannels);
    }
  };

  // SOCKET
  socket.onmessage = function (event) {
    const messageObj = JSON.parse(event.data);
    console.log("HOMEPAGE")

    if (messageObj.type === "channelUpdate") {
      const updatedChannel = {
        name: messageObj.content,
        id: messageObj.id,
      };
      updateChannel({ updatedChannel });
    } else if (messageObj.type === "channelDelete") {
      deleteChannel({ id: messageObj.id });
    }
  }

  return (
    <>
      <div className="container">
        <nav className="sideNavbar">
          <ul className="channels">
            {channels.map((channel, index) => (
              <li key={index}>
                <SocketContext.Provider value={{ socket, updateChannel, deleteChannel }}>
                  <ChannelItem channel={channel} admin={user.role === 1}/>
                </SocketContext.Provider>
              </li>
            ))}
          </ul>
        </nav>

        <div className="profileBar">
          <img
            src={user && user.profilePicture}
            width={180}
            height={150}
          ></img>
          <p onClick={() => navigate(`/users/${user.id}`)}>
            {user && user.userName}
          </p>
          <button className="logoutButton" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
      <UserContext.Provider value={{ users }}>
        <SocketContext.Provider value={{ socket, updateChannel, deleteChannel }}>
          <Routes>
            <Route path="/" element={<HomeSocketPage/>}/>
            <Route path="/channel/:channelId" element={<ChannelPage channels={channels}/>}/>
            <Route path="/users/:memberId" element={<ProfilePage updateUsers={updateUsers}/>}/>
          </Routes>
        </SocketContext.Provider>
      </UserContext.Provider>
    </>
  );
}

HomePage.propTypes = {
  user: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  setUsers: PropTypes.func.isRequired,
};
