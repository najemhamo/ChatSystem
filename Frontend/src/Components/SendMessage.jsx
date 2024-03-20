import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export default function SendMessage(props)
{
    const {socket, addMessage} = props
    const {channelId} = useParams()
    const [newMessage, setNewMessage] = useState({messageText: ""})
    const [createMessage, setCreateMessage] = useState({})

    useEffect(() =>
    {
        if (!createMessage.messageText)
        return

        socket.send(JSON.stringify({ type: "messageAdd", content: createMessage.messageText }));
    
        const postOptions =
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(createMessage)
        }
        
        fetch(`http://localhost:5007/chat/members/1/channels/${channelId}/message`, postOptions)
        .then((response) => response.json())
        .then(() => addMessage())
    }, [createMessage])

    const handleInput = (event) =>
    {
        setNewMessage({messageText: event.target.value})
    }

    const handleSend = () =>
    {
        if (newMessage.messageText.length === 0)
            return

        const message = {...newMessage, channelId: channelId, memberId: 1}
        setCreateMessage(message)
        setNewMessage({messageText: ""})
    }

    return (
        <>
        <input type="text" placeholder="New message" onChange={handleInput} value={newMessage.messageText}></input>
        <button onClick={handleSend}>Send</button>
        </>
    )
}