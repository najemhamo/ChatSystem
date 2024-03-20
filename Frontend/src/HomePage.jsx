
export default function HomePage(props)
{
    const {socket, updateChannel, deleteChannel} = props

    // Socket
    socket.onmessage = function (event)
    {
        const messageObj = JSON.parse(event.data)
        console.log("HOME RECE", messageObj.type)
        
        if (messageObj.type === "channelUpdate")
        {
            const updatedChannel =
            {
                name: messageObj.content,
                id: messageObj.id
            }
            updateChannel({updatedChannel})
        }
        
        else if (messageObj.type === "channelDelete")
        {
            deleteChannel({id: messageObj.id})
        }
    }

    return (
        <>
        </>
    )
}