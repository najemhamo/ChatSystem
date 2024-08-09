import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "./HomePage";
import SendMessage from "./Components/SendMessage";
import MessageItem from "./Components/MessageItem";
import PropTypes from "prop-types";

export default function ChannelPage(props) {
  const { channels } = props;
  const { channelId } = useParams();
  const [messages, setMessages] = useState([]);
  const { socket, updateChannel, deleteChannel } = useContext(SocketContext);
  const channel = channels[channelId - 1];

  // GET messages
  useEffect(() => {
    fetch(`http://localhost:5007/chat/channels/${channelId}/messages`)
      .then((response) => response.json())
      .then((data) => setMessages(data));
  }, [channelId]);

  // Socket
  socket.onmessage = function (event) {
    const messageObj = JSON.parse(event.data);

    if (messageObj.type === "messageAdd") addMessage()
    else if (messageObj.type === "messageUpdate") {
      const updatedMessage = {
        messageText: messageObj.content,
        channelId: channelId,
        memberId: messageObj.memberid,
        id: messageObj.id,
        createdAt: messageObj.createdAt
      };
      updateMessage({ updatedMessage });
    } else if (messageObj.type === "messageDelete") {
      deleteMessage({ id: messageObj.id });
    }


    // NECESSARY???
    // if (messageObj.type === "channelUpdate") {
    //   const updatedChannel = {
    //     name: messageObj.content,
    //     id: messageObj.id,
    //   };
    //   updateChannel({ updatedChannel });
    // } else if (messageObj.type === "channelDelete") {
    //   deleteChannel({ id: messageObj.id });
    // }
    //
  };

  // GET messages
  const addMessage = () => {
    fetch(`http://localhost:5007/chat/channels/${channelId}/messages`)
      .then((response) => response.json())
      .then((data) => setMessages(data));
  };

  const updateMessage = (data) => {
    if (messages.length === 0) {
      setMessages((message) =>
        message.map((msg) => {
          if (msg.id === data.updatedMessage.id) return data.updatedMessage;
          return msg;
        })
      );
    } else {
      const tmpMessages = messages.map((message) => {
        if (message.id === data.updatedMessage.id) return data.updatedMessage;
        return message;
      });

      setMessages(tmpMessages);
    }
  };

  const deleteMessage = (data) => {
    if (messages.length === 0)
      setMessages((messageList) =>
        messageList.filter((message) => {
          return message.id !== data.id;
        })
      );
    else {
      const tmpMessages = messages.filter((message) => {
        return message.id !== data.id;
      });
      setMessages(tmpMessages);
    }
  };

  return (
    <>
      <h1 className="titleSTICKY">{channel && channel.name}</h1>
      <ul className="scroll">
        {messages.map((message, index) => (
          <li key={index}>
            <MessageItem
              message={message}
              updateMessage={updateMessage}
              deleteMessage={deleteMessage}
            />
          </li>
        ))}
      </ul>

      <SendMessage addMessage={addMessage} />
    </>
  );
}

ChannelPage.propTypes = {
  channels: PropTypes.array.isRequired,
  socket: PropTypes.object.isRequired,
  updateChannel: PropTypes.func.isRequired,
  deleteChannel: PropTypes.func.isRequired,
};
