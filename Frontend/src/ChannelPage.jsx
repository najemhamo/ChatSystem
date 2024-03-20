import { useEffect, useState } from "react"
import SendMessage from "./Components/SendMessage"
import MessageItem from "./Components/MessageItem"
import { useParams } from "react-router-dom"

export default function ChannelPage(props)
{
    const {channels} = props
    const {channelId} = useParams()
    const [messages, setMessages] = useState([])
    const [socket] = useState(new WebSocket('ws://localhost:5007/chat'))

    // GET messages
    useEffect(() =>
    {
        fetch(`http://localhost:5007/chat/channels/${channelId}/messages`)
        .then((response) => response.json())
        .then((data) => setMessages(data))
    }, [])

    socket.onmessage = function (event)
    {
        const messageObj = JSON.parse(event.data)

        if (messageObj.type === "messageAdd")
        {
            const message =
            {
                messageText: messageObj.content,
                channelId: channelId,
                userId: 1
            }
            addMessage({message})
        }

        else if (messageObj.type === "messageUpdate")
        {
            const updatedMessage =
            {
                messageText: messageObj.content,
                channelId: channelId,
                userId: 1,
                id: messageObj.id
            }
            updateMessage({updatedMessage})
        }

        else if (messageObj.type === "messageDelete")
        {
            deleteMessage({id: messageObj.id})
        }
    }

    const channel = channels[channelId - 1]
    const addMessage = (data) =>
    {
        if (messages.length === 0)
            setMessages(messageList => [...messageList, 
            {
                ...data.message,
                id: messageList[messageList.length - 1].id + 1
            }])
        else
            setMessages([...messages, 
            {
                ...data.message,
                id: messages[messages.length - 1].id + 1
            }])        
    }

    const updateMessage = (data) =>
    {
        if (messages.length === 0)
        {
            setMessages(message => message.map((msg) =>
            {
                if (msg.id === data.updatedMessage.id) return data.updatedMessage
                return msg
            }))
        }
        else
        {
            const tmpMessages = messages.map((message) => {
                if (message.id === data.updatedMessage.id) return data.updatedMessage
                return message
            })

            setMessages(tmpMessages)
        }
    }

    const deleteMessage = (data) =>
    {
        if (messages.length === 0)
            setMessages(messageList => messageList.filter((message) => {return message.id !== data.id}))
        else
        {
            const tmpMessages = messages.filter((message) => {return message.id !== data.id})
            setMessages(tmpMessages)
        }
    }

    return (
        <>
        <h1>{channel && channel.name}</h1>
        <ul>
            {messages.map((message, index) =>
            (
                <li key={index}><MessageItem message={message} socket={socket} updateMessage={updateMessage} deleteMessage={deleteMessage}/></li>
            ))}
        </ul>

        <SendMessage socket={socket} addMessage={addMessage}/>
        </>
    )
}