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

      // UPDATE the channel name
      const putOptions = {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
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
        "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
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
        <div className="fixChannel">
          <p onClick={() => navigate(`/channel/${channel.id}`)}>{channel.name}</p>
          {admin &&
          <div>
            <i className="fa fa-bars" onClick={handleEdit}></i>
            <i className="fa fa-trash rightPad" onClick={handleDelete}></i>
          </div>
          }
        </div>
      )}
      {buttonText === "Save" && (
        <div className="fixChannel">
          <input
            id="editedChannel"
            type="text"
            defaultValue={channel.name}
          ></input>
          {admin &&
          <div>
            <i onClick={handleEdit}> &#10003;</i>
            <i className="fa fa-trash rightPad" onClick={handleDelete}></i>
          </div>
          }
        </div>
      )}
    </>
  );
}

ChannelItem.propTypes = {
  channel: PropTypes.object,
  admin: PropTypes.bool
};
