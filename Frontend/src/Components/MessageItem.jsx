import { useContext, useEffect, useState } from "react"
import { UserContext } from "../HomePage"

export default function MessageItem(props)
{
    const {message, socket, updateMessage, deleteMessage} = props
    const {users} = useContext(UserContext)
    const user = users[message.userId - 1]

    const [buttonText, setButtonText] = useState("Edit")
    const [newMessage, setNewMessage] = useState([])
    const [messageUpdate, setMessageUpdate] = useState({})
    const [messageDelete, setMessageDelete] = useState({})

    // UPDATE message
    useEffect(() =>
    {
        if (!messageUpdate.messageText)
        return

        socket.send(JSON.stringify({ type: "messageUpdate", content: messageUpdate.messageText, id: messageUpdate.id }));
    
        // const putOptions =
        // {
        //     method: "PUT",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify(messageUpdate)
        // }
        
        // fetch(`http://localhost:5007/chat/messages/${messageUpdate.id}`, putOptions)
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
            if (newMessage.messageText.length === 0)
                return

            let updatedMessage = message
            updatedMessage.messageText = newMessage.messageText

            setMessageUpdate(updatedMessage)
            updateMessage({updatedMessage})
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
        <div>
            {buttonText === "Edit" && <p>{message && message.messageText} {user && user.userName}</p>}
            {buttonText === "Save" && <input type="text" placeholder={message.messageText} onChange={handleInput}></input>}

            <button onClick={handleEdit}>{buttonText}</button>
            <button onClick={handleDelete}>Delete</button>

            {/* {user.id === 1 && <button onClick={handleEdit}>{buttonText}</button>} */}
            {/* {user.id === 1 && <button>Delete</button>} */}
        </div>
    </>
    )
}