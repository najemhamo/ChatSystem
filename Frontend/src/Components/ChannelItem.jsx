import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../HomePage";
import PropTypes from "prop-types";

export default function ChannelItem(props) {
  const { channel, admin } = props;
  const [buttonText, setButtonText] = useState("Edit");
  const { socket, updateChannel, deleteChannel } = useContext(SocketContext);
  const navigate = useNavigate();

  const handleEdit = () => {
    if (buttonText === "Save")
    {
      // Create the new channel name
      const channelName = document.getElementById("editedChannel").value    
      if (channelName.length === 0 || channelName === channel.name)
      {
        setButtonText("Edit");
        return;
      }
      channel.name = channelName
      const updatedChannel = channel

      // Websocket edit channel
      socket.send(
      JSON.stringify({
        type: "channelUpdate",
        content: channelName,
        id: channel.id,
        })
      )

      const token = localStorage.getItem("authToken")

      // UPDATE the channel name
      const putOptions = {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({name: channelName}),
      };

      fetch(`http://localhost:5007/chat/channels/${channel.id}`, putOptions)
      updateChannel({ updatedChannel });
      setButtonText("Edit");
    } else setButtonText("Save");
  };

  const handleDelete = () => 
  {
    // Delete channel Websocket
    socket.send(
      JSON.stringify({
        type: "channelDelete",
        content: "",
        id: channel.id,
      })
    );
    deleteChannel({ id: channel.id });


    // DELETE channel
    const deleteOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(channel),
    };

    fetch(
      `http://localhost:5007/chat/channels/${channel.id}?id=${channel.id}`,
      deleteOptions
    );
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      ></link>

      {buttonText === "Edit" && (
        <p onClick={() => navigate(`/channel/${channel.id}`)}>{channel.name}</p>
      )}
      {buttonText === "Save" && (
        <input
          id="editedChannel"
          type="text"
          defaultValue={channel.name}
        ></input>
      )}

      {admin && 
      <div className="channelButtons">
        <button className="editButton" onClick={handleEdit}>
          <i className="fa fa-bars"></i> {buttonText}
        </button>
        <button className="editButton" onClick={handleDelete}>
          <i className="fa fa-trash"></i> Delete
        </button>
      </div>
      }
    </>
  );
}

ChannelItem.propTypes = {
  channel: PropTypes.object.isRequired,
  admin: PropTypes.bool.isRequired,
  socket: PropTypes.object.isRequired,
  updateChannel: PropTypes.func.isRequired,
  deleteChannel: PropTypes.func.isRequired,
};
