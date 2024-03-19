import { createContext, useEffect, useState } from "react"
import { Route, Routes, useNavigate } from "react-router-dom"
import ProfilePage from "./ProfilePage"
import ChannelPage from "./ChannelPage"

export const UserContext = createContext()

export default function HomePage()
{
    const [channels, setChannels] = useState([])
    const [users, setUsers] = useState([])

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
        fetch("http://localhost:5007/chat/users")
        .then((response) => response.json())
        .then((data) => setUsers(data))
    }, [])

    const navigate = useNavigate()

    const updateUsers = (data) =>
    {
        const newUsers = users.map((user) =>
        {
            if (user.id === data.updatedUser.id) return data.updatedUser
            return user
        })

        setUsers(newUsers)
    }

    return (
        <>
        <h1>Chat Application</h1>
        <ul>
            {channels.map((channel, index) =>
            (
                <li onClick={() => navigate(`/channel/${channel.id}`)} key={index}>{channel.name}</li>
            ))}
        </ul>

        <div>
            <p onClick={() => navigate(`/users/${users[0].id}`)}>{users[0] && users[0].userName}</p>
        </div>

        <UserContext.Provider value={{users}}>
            <Routes>
                <Route path='/channel/:channelId' element={<ChannelPage channels={channels}/>}/>
                <Route path="/users/:userId" element={<ProfilePage updateUsers={updateUsers}/>}/>
            </Routes>
        </UserContext.Provider>
        </>
    )
}