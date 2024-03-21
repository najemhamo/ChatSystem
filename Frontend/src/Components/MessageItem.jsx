import { useContext, useEffect, useState } from "react"
import { UserContext } from "../HomePage"
import { AuthContext } from "../App"
import { useNavigate } from "react-router-dom"

export default function MessageItem(props)
{
    const {message, socket, updateMessage, deleteMessage} = props
    const {users} = useContext(UserContext)
    const {user} = useContext(AuthContext)
    const navigate = useNavigate()
    const messageUser = users[message.memberId - 1]

    const [buttonText, setButtonText] = useState("Edit")
    const [newMessage, setNewMessage] = useState([])
    const [messageUpdate, setMessageUpdate] = useState({})
    const [messageDelete, setMessageDelete] = useState({})
    const ownMessage = user[0] && messageUser && user[0].id === messageUser.id ? true : false

    // UPDATE message
    useEffect(() =>
    {
        if (!messageUpdate.messageText)
        return

        socket.send(JSON.stringify({ type: "messageUpdate", content: messageUpdate.messageText, id: messageUpdate.id }));
    
        const putOptions =
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(messageUpdate)
        }
        
        fetch(`http://localhost:5007/chat/messages/${messageUpdate.id}`, putOptions)
    }, [messageUpdate])

    // DELETE message
    useEffect(() =>
    {
        if (!messageDelete.messageText)
        return
    
        socket.send(JSON.stringify({ type: "messageDelete", content: "", id: message.id }));
        deleteMessage({id: messageDelete.id})

        const deleteOptions =
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(messageDelete)
        }
        
        fetch(`http://localhost:5007/chat/messages/${message.id}?id=${message.id}`, deleteOptions)
    }, [messageDelete])

    const handleEdit = () =>
    {
        if (buttonText === "Save")
        {
            if (!newMessage.messageText || newMessage.messageText.length === 0)
            {
                setButtonText("Edit")
                return
            }

            let updatedMessage = message
            updatedMessage.messageText = newMessage.messageText

            setMessageUpdate(updatedMessage)
            updateMessage({updatedMessage})
            setNewMessage([])
            setButtonText("Edit")
        }
        else
            setButtonText("Save")
    }

    const handleDelete = () =>
    {
        setMessageDelete(message)
    }

    const handleInput = (event) =>
    {
        setNewMessage({messageText: event.target.value})
    }
    
    return (
    <>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>

        <div>
            <div>
                <p className="usernameText" onClick={() => navigate(`/users/${messageUser.id}`)}>{messageUser && messageUser.userName}</p>
                <p className="time">{message.createdAt}</p>
            </div>
            
            <div>
                {buttonText === "Edit" && <p className={ownMessage ? "messageTexting textFix" : "messageTexting"}>{message && message.messageText}</p>}
                {buttonText === "Save" && <input className={ownMessage ? "messageTexting textFix" : "messageTexting"} type="text" placeholder={message.messageText} onChange={handleInput}></input>}

                {ownMessage &&
                <>
                    <button className="messageBth messageEdit" onClick={handleEdit}><i className="fa fa-bars"></i></button>
                    <button className="messageBth" onClick={handleDelete}><i className="fa fa-trash"></i></button>
                </>}
            </div>
        </div>
    </>
    )
}