import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export default function SendMessage(props)
{
    const {updateMessages} = props
    const {channelId} = useParams()
    const [newMessage, setNewMessage] = useState({messageText: ""})
    const [createMessage, setCreateMessage] = useState({})
    const [socket] = useState(new WebSocket('ws://localhost:5007/chat'))

    useEffect(() =>
    {
        if (!createMessage.messageText)
        return

        socket.send(JSON.stringify({ type: "message", content: createMessage.messageText }));
    
        const postOptions =
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(createMessage)
        }
        
        fetch(`http://localhost:5007/chat/users/1/channels/${channelId}/message`, postOptions)
    }, [createMessage])

    socket.onmessage = function (event)
    {
        if (JSON.parse(event.data).content.length === 0)
            return

        const message =
        {
            messageText: JSON.parse(event.data).content,
            channelId: channelId,
            userId: 1
        }
        updateMessages({message})
    }

    const handleInput = (event) =>
    {
        setNewMessage({messageText: event.target.value})
    }

    const handleSend = () =>
    {
        if (newMessage.messageText.length === 0)
            return

        const message = {...newMessage, channelId: channelId, userId: 1}
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