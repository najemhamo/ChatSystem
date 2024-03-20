import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function ChannelItem(props)
{
    const {channel, socket, updateChannel, deleteChannel} = props
    const [buttonText, setButtonText] = useState("Edit")
    const [newChannel, setNewChannel] = useState([])
    const [channelUpdate, setChannelUpdate] = useState({})
    const [channelDelete, setChannelDelete] = useState({})
    const navigate = useNavigate()

    // UPDATE channel
    useEffect(() =>
    {
        if (!channelUpdate.name)
        return

        socket.send(JSON.stringify({ type: "channelUpdate", content: channelUpdate.name, id: channelUpdate.id }));
    
        // const putOptions =
        // {
        //     method: "PUT",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify(channelUpdate)
        // }
        
        // fetch(`http://localhost:5007/chat/channels/${channelUpdate.id}`, putOptions)
    }, [channelUpdate])

    // DELETE channel
    useEffect(() =>
    {
        if (!channelDelete.name)
        return
    
        socket.send(JSON.stringify({ type: "channelDelete", content: "", id: channelDelete.id }));
        deleteChannel({id: channelDelete.id})

        // const deleteOptions =
        // {
        //     method: "DELETE",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify(channelDelete)
        // }
        
        // fetch(`http://localhost:5007/chat/channels/${channelDelete.id}?id=${channelDelete.id}`, deleteOptions)
    }, [channelDelete])

    const handleInput = (event) =>
    {
        setNewChannel({name: event.target.value})
    }

    const handleEdit = () =>
    {
        if (buttonText === "Save")
        {
            if (!newChannel.name || newChannel.name.length === 0)
                return

            let updatedChannel = channel
            updatedChannel.name = newChannel.name

            setChannelUpdate(updatedChannel)
            updateChannel({updatedChannel})
            setButtonText("Edit")
        }
        else
            setButtonText("Save")
    }

    const handleDelete = () =>
    {
        setChannelDelete(channel)
    }

    return (
        <>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
            
            {buttonText === "Edit" && <p onClick={() => navigate(`/channel/${channel.id}`)}>{channel.name}</p>}
            {buttonText === "Save" && <input type="text" placeholder={channel.name} onChange={handleInput} value={newChannel.name}></input>}
                
            <div className="channelButtons">
                <button className="fa fa-bars" onClick={handleEdit}></button>
                <button className="fa fa-trash" onClick={handleDelete}></button>
            </div>
        </>
    )
}