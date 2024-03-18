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
        fetch("https://localhost:7006/chat/channels")
        .then((response) => response.json())
        .then((data) => setChannels(data))
    }, [])


    // GET users
    useEffect(() =>
    {
        fetch("https://localhost:7006/chat/users")
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
        <h1>HomePage</h1>
        <ul>
            {channels.map((channel, index) =>
            (
                <li onClick={() => navigate(`/channel/${channel.id}`)} key={index}>{channel.name}</li>
            ))}
        </ul>

        <div>
            <p onClick={() => navigate(`/users/1`)}>{users[0] && users[0].userName}</p>
        </div>

        <UserContext.Provider value={{users}}>
            <Routes>
                <Route path="/users/:userId" element={<ProfilePage updateUsers={updateUsers}/>}/>
                <Route path='/channel/:channelId' element={<ChannelPage channels={channels}/>}/>
            </Routes>
        </UserContext.Provider>
        </>
    )
}