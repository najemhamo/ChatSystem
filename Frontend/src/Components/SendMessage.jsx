import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../App";
import { SocketContext } from "../HomePage";
import PropTypes from "prop-types";

export default function SendMessage(props) {
  const { addMessage } = props;
  const { user } = useContext(AuthContext);
  const { channelId } = useParams();
  const [newMessage, setNewMessage] = useState({ messageText: "" });
  const [createMessage, setCreateMessage] = useState({});
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    if (!createMessage.messageText) return;

    const postOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createMessage),
    };

    fetch(
      `http://localhost:5007/chat/members/1/channels/${channelId}/message`,
      postOptions
    )
      .then((response) => response.json())
      // .then(() => addMessage())
      .then(() => {
        addMessage();
        socket.send(
          JSON.stringify({
            type: "messageAdd",
            content: createMessage.messageText,
          })
        );
      });
  }, [createMessage]);

  const handleInput = (event) => {
    setNewMessage({ messageText: event.target.value });
  };

  const handleSend = () => {
    if (newMessage.messageText.length === 0) return;

    const message = {
      ...newMessage,
      channelId: channelId,
      memberId: user.id,
    };
    setCreateMessage(message);
    setNewMessage({ messageText: "" });
  };

  return (
    <>
      <input
        className="messageSend"
        type="text"
        placeholder="New message"
        onChange={handleInput}
        value={newMessage.messageText}
      ></input>
      <button className="sendBth" onClick={handleSend}>
        Send
      </button>
    </>
  );
}

SendMessage.propTypes = {
  socket: PropTypes.object.isRequired,
  addMessage: PropTypes.func.isRequired,
};
