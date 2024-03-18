import { createContext, useEffect, useState } from "react"
import { Route, Routes, useNavigate } from "react-router-dom"
import ChannelPage from "./ChannelPage"

export const UserContext = createContext()

export default function HomePage()
{
    const LOCAL_CHANNELS =
    [
        {
            id: 1,
            name: "fandom-discussions"
        }
    ]
    const [channels, setChannels] = useState(LOCAL_CHANNELS)
    const LOCAL_USERS =
    [
        {
            id: 1,
            userName: "Klara"
        }
    ]
    const [users, setUsers] = useState(LOCAL_USERS)

    // GET channels
    useEffect(() =>
    {
        // fetch("")
        // .then((response) => response.json())
        // .then((data) => setChannels(data))
    }, [])


    // GET users
    useEffect(() =>
    {
        // fetch("")
        // .then((response) => response.json())
        // .then((data) => setUsers(data))
    }, [])

    const navigate = useNavigate()


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
            <p>{users[0].userName}</p>
        </div>

        <UserContext.Provider value={{users}}>
            <Routes>
                <Route path='/channel/:channelId' element={<ChannelPage channels={channels}/>}/>
            </Routes>
        </UserContext.Provider>
        </>
    )
}