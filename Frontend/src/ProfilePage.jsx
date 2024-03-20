import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export default function ProfilePage(props)
{
    const {socket, updateUsers, updateChannel, deleteChannel} = props
    const {memberId} = useParams()
    const [buttonText, setButtonText] = useState("Edit")

    const INITIAL_USER =
    {
        userName: "",
        name: "",
        aboutMe: ""
    }
    const [newUser, setNewUser] = useState(INITIAL_USER)
    const [updateUser, setUpdateUser] = useState({})
    const [user, setUser] = useState({})
    const ownUserProfile = parseInt(memberId) === 1

    // GET user by id
    useEffect(() =>
    {
        fetch(`http://localhost:5007/chat/members/${memberId}`)
        .then((response) => response.json())
        .then((data) => setUser(data))
    }, [])

    // PUT new user
    useEffect(() =>
    {
        if (!updateUser.userName)
            return

        socket.send(JSON.stringify({ type: "userUpdate", content: updateUser }));

        const putOptions =
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updateUser)
        }

        fetch(`http://localhost:5007/chat/members/${memberId}`, putOptions)

    }, [updateUser])

    // Socket
    socket.onmessage = function (event)
    {
        const messageObj = JSON.parse(event.data)
        console.log("PROFILE PAGE SOCKET")

        if (messageObj.type === "userUpdate")
        {
            const updatedUser = {...messageObj.content}
            updateUsers({updatedUser})   
        }

        if (messageObj.type === "channelUpdate")
        {
            const updatedChannel =
            {
                name: messageObj.content,
                id: messageObj.id
            }
            updateChannel({updatedChannel})
        }
        
        else if (messageObj.type === "channelDelete")
        {
            deleteChannel({id: messageObj.id})
        }
    }

    const handleClick = () =>
    {
        if (buttonText === "Save")
        {
            const updatedUser = newUser
            
            if (updatedUser.userName.length === 0)
                updatedUser.userName = user.userName

            if (updatedUser.name.length === 0)
                updatedUser.name = user.name

            if (updatedUser.aboutMe.length === 0)
                updatedUser.aboutMe = user.aboutMe

            updatedUser.profilePicture = user.profilePicture
            updatedUser.id = user.id

            setUpdateUser(updatedUser)
            updateUsers({updatedUser})
            setUser(updatedUser)
            setNewUser(INITIAL_USER)
            setButtonText("Edit")
        }
        else
            setButtonText("Save")
    }

    const handleInput = (event) =>
    {
        const {name, value} = event.target
        const tmpUser = {...newUser, [name]: value}
        setNewUser(tmpUser)
    }

    return (
        <>
            <h1>User Information</h1>
            {buttonText === "Edit" && <p>{user.userName}</p>}
            {buttonText === "Edit" && <p>{user.name}</p>}
            {buttonText === "Edit" && <p>{user.aboutMe}</p>}

            <img src={user.profilePicture} width={380} height={300}></img>

            {buttonText === "Save" && <input name="userName" type="text" onChange={handleInput} placeholder={user.userName} value={newUser.userName}></input>}
            {buttonText === "Save" && <input name="name" type="text" onChange={handleInput} placeholder={user.name} value={newUser.name}></input>}
            {buttonText === "Save" && <input name="aboutMe" type="text" onChange={handleInput} placeholder={user.aboutMe} value={newUser.aboutMe}></input>}
            
            {ownUserProfile && <button onClick={handleClick}>{buttonText}</button>}
        </>
    )
}