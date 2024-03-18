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
        // fetch("")
        // .then((response) => response.json())
        // .then((data) => setMessages(data))
    }, [])

    const channel = channels[channelId - 1]
    const updateMessages = (data) =>
    {
        setMessages([...messages, data.message])
    }

    return (
        <>
        <h1>{channel.name}</h1>
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