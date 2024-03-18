import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export default function SendMessage(props)
{
    const {updateMessages} = props
    const {channelId} = useParams()
    const [newMessage, setNewMessage] = useState({})
    const [createMessage, setCreateMessage] = useState({})

    useEffect(() =>
    {
        if (!createMessage.messageText)
            return

        const postOptions =
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(createMessage)
        }

        fetch(`https://localhost:7006/chat/users/${1}/channels/${channelId}/message`, postOptions)
    }, [createMessage])

    const handleInput = (event) =>
    {
        setNewMessage({messageText: event.target.value})
    }

    const handleSend = () =>
    {
        if (!newMessage.messageText || newMessage.messageText.length === 0)
            return

        const message = {...newMessage, channelId: channelId, userId: 1}

        setCreateMessage(message)
        updateMessages({message})
        setNewMessage({messageText: ""})
    }

    return (
        <>
        <input type="text" placeholder="New message" onChange={handleInput} value={newMessage.text}></input>
        <button onClick={handleSend}>Send</button>
        </>
    )
}