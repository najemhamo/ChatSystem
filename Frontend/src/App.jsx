import { Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import HomePage from './HomePage'
import { createContext } from 'react'
import { useEffect, useState } from 'react'
import ChannelPage from './ChannelPage'
import ProfilePage from './ProfilePage'
import ChannelItem from './Components/ChannelItem'

export const UserContext = createContext()

function App() {
  const [socket] = useState(new WebSocket('ws://localhost:5007/chat'))
  const [channels, setChannels] = useState([])
  const [users, setUsers] = useState([])
  const navigate = useNavigate()

  // GET channels
    useEffect(() =>
    {
        fetch("http://localhost:5007/chat/channels")
        .then((response) => response.json())
        .then((data) => setChannels(data))
    }, [])

    // GET users
    useEffect(() =>
    {
        fetch("http://localhost:5007/chat/members")
        .then((response) => response.json())
        .then((data) => setUsers(data))
    }, [])

    // Users
    const updateUsers = (data) =>
    {
        const newUsers = users.map((user) =>
        {
            if (user.id === data.updatedUser.id) return data.updatedUser
            return user
        })

        setUsers(newUsers)
    }

    // CHANNELS
    const updateChannel = (data) =>
    {
        if (channels.length === 0)
        {
            setChannels(channelList => channelList.map((chn) =>
            {
                if (chn.id === data.updatedChannel.id) return data.updatedChannel
                return chn
            }))
        }
        else
        {
            const tmpChannels = channels.map((chn) => {
                if (chn.id === data.updatedChannel.id) return data.updatedChannel
                return chn
            })

        setChannels(tmpChannels)
        }
    }

    const deleteChannel = (data) =>
    {
        if (channels.length === 0)
            setChannels(channelList => channelList.filter((chn) => {return chn.id !== data.id}))
        else
        {
            const tmpChannels = channels.filter((chn) => {return chn.id !== data.id})
            setChannels(tmpChannels)
        }
    }

  return (
    <>
      <h1>Chat Application</h1>
        <div className="container">
            <div className="container-main">
                <nav className="sidebar">
                    <ul>
                        {channels.map((channel, index) =>
                        (
                            <li className="sidebar" key={index}>
                                <ChannelItem channel={channel} socket={socket} updateChannel={updateChannel} deleteChannel={deleteChannel}/>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>

        <div>
            <p onClick={() => navigate(`/users/${users[0].id}`)}>{users[0] && users[0].userName}</p>
        </div>

      <UserContext.Provider value={{users}}>
            <Routes>
                <Route path='/' element={<HomePage socket={socket} updateChannel={updateChannel} deleteChannel={deleteChannel}/>}/>
                <Route path='/channel/:channelId' element={<ChannelPage channels={channels} socket={socket} updateChannel={updateChannel} deleteChannel={deleteChannel}/>}/>
                <Route path="/users/:memberId" element={<ProfilePage socket={socket} updateUsers={updateUsers} updateChannel={updateChannel} deleteChannel={deleteChannel}/>}/>
            </Routes>
        </UserContext.Provider>
    </>
  )
}

export default App