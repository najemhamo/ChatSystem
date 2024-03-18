import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { UserContext } from "./HomePage"

export default function ProfilePage(props)
{
    const {updateUsers} = props
    const {userId} = useParams()
    const {users} = useContext(UserContext)
    const [buttonText, setButtonText] = useState("Edit")

    const INITIAL_USER =
    {
        userName: "",
        name: "",
        aboutMe: ""
    }
    const [newUser, setNewUser] = useState(INITIAL_USER)
    const [updateUser, setUpdateUser] = useState({})

    const user = users[userId - 1]
    const ownUserProfile = user.id === 1

    // PUT new user
    useEffect(() =>
    {
        if (!updateUser.userName)
            return

        const putOptions =
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updateUser)
        }

        fetch("", putOptions)

    }, [updateUser])


    const handleClick = () =>
    {
        if (buttonText === "Save")
        {
            const updatedUser = newUser
            
            if (updatedUser.userName.length === 0)
                updateUser.userName = user.userName

            if (updatedUser.name.length === 0)
                updateUser.name = user.name

            if (updatedUser.aboutMe.length === 0)
                updateUser.aboutMe = user.aboutMe

            updatedUser.id = user.id
            setUpdateUser(updatedUser)
            updateUsers({updatedUser})
            setButtonText("Edit")
        }
        else
            setButtonText("Save")
    }

    const handleInput = (event) =>
    {
        const {name, value} = event.target
        setNewUser({...newUser, [name]: value})
    }
 
    return (
        <>
            <h1>User Information</h1>
            {buttonText === "Edit" && <p>{user.userName}</p>}
            {buttonText === "Edit" && <p>{user.name}</p>}
            {buttonText === "Edit" && <p>{user.aboutMe}</p>}

            {buttonText === "Save" && <input name="userName" type="text" onChange={handleInput} placeholder={user.userName} value={newUser.userName}></input>}
            {buttonText === "Save" && <input name="name" type="text" onChange={handleInput} placeholder={user.name} value={newUser.name}></input>}
            {buttonText === "Save" && <input name="aboutMe" type="text" onChange={handleInput} placeholder={user.aboutMe} value={newUser.aboutMe}></input>}
            
            {ownUserProfile && <button onClick={handleClick}>{buttonText}</button>}
        </>
    )
}