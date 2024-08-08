import { useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../App";
import { SocketContext } from "../HomePage";
import PropTypes from "prop-types";

export default function SendMessage(props) {
  const { addMessage } = props;
  const { user } = useContext(AuthContext);
  const { channelId } = useParams();
  const { socket } = useContext(SocketContext);

  const onSendMessage = (event) =>
  {
    // Creates the message
    event.preventDefault()
    const newMessage = event.target.message.value
    if (newMessage.length === 0)
      return

    const message = {
      messageText: newMessage,
      channelId: channelId,
      memberId: user.id,
    }


    // POST new message
    const postOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    };

    fetch(
      `http://localhost:5007/chat/members/${user.id}/channels/${channelId}/message`,
      postOptions
    )
      .then((response) => response.json())
      .then(() => {
        addMessage()

        // Websocket send message
        socket.send(
          JSON.stringify({
            type: "messageAdd",
            content: message,
          })
        );
      });
  }

  return (
    <>
    <form onSubmit={onSendMessage}>
      <input
        className="messageSend"
        type="text"
        name="message"
        placeholder="New message"
        ></input>
        <button className="sendBth">Send</button>
      </form>
    </>
  );
}

SendMessage.propTypes = {
  socket: PropTypes.object.isRequired,
  addMessage: PropTypes.func.isRequired,
};
