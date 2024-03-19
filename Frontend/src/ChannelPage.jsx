import { useEffect, useState } from "react"
import SendMessage from "./Components/SendMessage"
import MessageItem from "./Components/MessageItem"
import { useParams } from "react-router-dom"

export default function ChannelPage(props)
{
    const {channels} = props
    const {channelId} = useParams()
    const [messages, setMessages] = useState([])

    // GET messages
    useEffect(() =>
    {
        fetch(`http://localhost:5007/chat/channels/${channelId}/messages`)
        .then((response) => response.json())
        .then((data) => setMessages(data))
    }, [])

    const channel = channels[channelId - 1]
    const updateMessages = (data) =>
    {
        if (messages.length === 0)
            setMessages(message => [...message, data.message])
        else
            setMessages([...messages, data.message])
    }

    return (
        <>
        <h1>{channel && channel.name}</h1>
        <ul>
            {messages.map((message, index) =>
            (
                <li key={index}><MessageItem message={message}/></li>
            ))}
        </ul>

        <SendMessage updateMessages={updateMessages}/>
        </>
    )
}