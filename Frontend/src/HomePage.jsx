import { createContext, useEffect, useState } from "react"
import { Route, Routes, useNavigate } from "react-router-dom"
import ProfilePage from "./ProfilePage"

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
            userName: "Glimra",
            name: "Klara Andersson",
            aboutMe: "Am I working hard, or hardly working?"
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
            <p onClick={() => navigate(`/users/1`)}>{users[0].userName}</p>
        </div>

        <UserContext.Provider value={{users}}>
            <Routes>
                <Route path="/users/:userId" element={<ProfilePage updateUsers={updateUsers}/>}/>
            </Routes>
        </UserContext.Provider>
        </>
    )
}