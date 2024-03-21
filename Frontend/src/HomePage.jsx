import { createContext, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import ChannelPage from "./ChannelPage";
import ProfilePage from "./ProfilePage";
import HomeSocketPage from "./HomeSocketPage";
import ChannelItem from "./Components/ChannelItem";
import PropTypes from "prop-types";

export const UserContext = createContext();

export default function HomePage(props) {
  const { user, logout, users, setUsers } = props;
  const [socket] = useState(new WebSocket("ws://localhost:5007/chat"));
  const [channels, setChannels] = useState([]);
  const navigate = useNavigate();

  // GET channels
  useEffect(() => {
    fetch("http://localhost:5007/chat/channels")
      .then((response) => response.json())
      .then((data) => setChannels(data));
  }, []);

  // Users
  const updateUsers = (data) => {
    const newUsers = users.map((user) => {
      if (user.id === data.updatedUser.id) return data.updatedUser;
      return user;
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
  console.log("User", user);
  return (
    <>
      {/* <h1 className="Welcome"> Chat Application</h1> */}
      <div className="container">
        {/* <div className="container-main"> */}
        <nav className="sideNavbar">
          <ul className="channels">
            {channels.map((channel, index) => (
              <li key={index}>
                <ChannelItem
                  channel={channel}
                  socket={socket}
                  updateChannel={updateChannel}
                  deleteChannel={deleteChannel}
                />
              </li>
            ))}
          </ul>
        </nav>
        {/* </div> */}

        <div className="profileBar">
          <img src={user[0].profilePicture} width={180} height={150}></img>
          <p onClick={() => navigate(`/users/${user[0].id}`)}>
            {user[0] && user[0].userName}
          </p>
          <button className="logoutButton" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
      <UserContext.Provider value={{ users }}>
        <Routes>
          <Route
            path="/"
            element={
              <HomeSocketPage
                socket={socket}
                updateChannel={updateChannel}
                deleteChannel={deleteChannel}
              />
            }
          />
          <Route
            path="/channel/:channelId"
            element={
              <ChannelPage
                channels={channels}
                socket={socket}
                updateChannel={updateChannel}
                deleteChannel={deleteChannel}
              />
            }
          />
          <Route
            path="/users/:memberId"
            element={
              <ProfilePage
                socket={socket}
                updateUsers={updateUsers}
                updateChannel={updateChannel}
                deleteChannel={deleteChannel}
              />
            }
          />
        </Routes>
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
