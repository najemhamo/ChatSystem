import { useEffect, useState } from "react"

export default function HomePage()
{
    const LOCAL_CHANNELS =
    [
        {
            id: 0,
            name: "fandom-discussions"
        }
    ]
    const [channels, setChannels] = useState(LOCAL_CHANNELS)
    const LOCAL_USERS =
    [
        {
            id: 0,
            userName: "Klara"
        }
    ]
    const [users, setUsers] = useState(LOCAL_USERS)

    // GET channels
    useEffect(() =>
    {
        fetch("")
        .then((response) => response.json())
        .then((data) => setChannels(data))
    }, [])

    
    // GET users
    useEffect(() =>
    {
        fetch("")
        .then((response) => response.json())
        .then((data) => setUsers(data))
    }, [])



    return (
        <>
        <h1>This is home</h1>
        <ul>
            {channels.map((channel, index) =>
            (
                <li key={index}>{channel.name}</li>
            ))}
        </ul>

        <div>
            <p>{users[0].userName}</p>
        </div>
        </>
    )
}