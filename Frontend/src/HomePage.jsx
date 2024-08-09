import { createContext, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./App";
import ChannelPage from "./ChannelPage";
import ProfilePage from "./ProfilePage";
import ChannelItem from "./Components/ChannelItem";
import PropTypes from "prop-types";

export const SocketContext = createContext();

export default function HomePage() {
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

  const addChannel = () =>
  {
    // GET channels
    fetch("http://localhost:5007/chat/channels")
    .then((response) => response.json())
    .then((data) => setChannels(data))
  }

  const onAddChannel = () =>
  {
    // POST new channel
    const postOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({name: "New Channel"}),
    };

    fetch(
      `http://localhost:5007/chat/channels`,
      postOptions
    )
      .then((response) => response.json())
      .then(() => {
        addChannel()

        // Websocket new channel
        socket.send(
          JSON.stringify({
            type: "channelAdd"
          })
        );
      });
  }

  // SOCKET
  socket.onmessage = function (event) {
    const messageObj = JSON.parse(event.data);

    if (messageObj.type === "channelUpdate")
    {
      const updatedChannel = {
        name: messageObj.content,
        id: messageObj.id,
      };
    updateChannel({ updatedChannel });
    }
    else if (messageObj.type === "channelDelete")
      deleteChannel({ id: messageObj.id })
    else if (messageObj.type === "channelAdd")
      addChannel()
  }

  return (
    <>
      <div className="container">
        <nav className="sideNavbar">
          <ul className="channels">
            {channels.map((channel, index) => (
              <li key={index}>
                <SocketContext.Provider value={{ socket, updateChannel, deleteChannel }}>
                  <ChannelItem channel={channel} admin={true}/>
                </SocketContext.Provider>
              </li>
            ))}
          </ul>
          <button onClick={onAddChannel}>+</button>
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
        <SocketContext.Provider value={{ socket, updateChannel, deleteChannel }}>
          <Routes>
            <Route path="/channel/:channelId" element={<ChannelPage channels={channels}/>}/>
            <Route path="/users/:memberId" element={<ProfilePage/>}/>
          </Routes>
        </SocketContext.Provider>
    </>
  );
}

HomePage.propTypes = {
  user: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  setUsers: PropTypes.func.isRequired,
};
