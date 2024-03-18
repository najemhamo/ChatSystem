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
        if (!createMessage.text)
            return

        const postOptions =
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(createMessage)
        }

        // fetch("", postOptions)
        // .then((response) => response.json())
        // .then((data) => updateMessages(data))
    }, [createMessage])

    const handleInput = (event) =>
    {
        setNewMessage({text: event.target.value})
    }

    const handleSend = () =>
    {
        if (!newMessage.text || newMessage.text.length === 0)
            return

        const message = {...newMessage, channelId: channelId, userId: 1}
        setCreateMessage(message)
        setNewMessage({text: ""})
        updateMessages({message})
    }

    return (
        <>
        <input type="text" placeholder="New message" onChange={handleInput} value={newMessage.text}></input>
        <button onClick={handleSend}>Send</button>
        </>
    )
}