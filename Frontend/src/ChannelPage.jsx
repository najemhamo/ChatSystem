import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "./HomePage";
import SendMessage from "./Components/SendMessage";
import MessageItem from "./Components/MessageItem";

export default function ChannelPage() {
  const { channelId } = useParams();
  const [channel, setChannel] = useState([]);
  const [messages, setMessages] = useState([]);
  const { socket } = useContext(SocketContext);

  // GET channel
  useEffect(() => {
    fetch(`http://localhost:5007/chat/channels/${channelId}`)
      .then((response) => response.json())
      .then((data) => setChannel(data));
  }, [channelId]);

  // GET messages
  useEffect(() => {
    fetch(`http://localhost:5007/chat/channels/${channelId}/messages`)
      .then((response) => response.json())
      .then((data) => setMessages(data));
  }, [channelId]);

  // GET messages
  const addMessage = () => {
    fetch(`http://localhost:5007/chat/channels/${channelId}/messages`)
      .then((response) => response.json())
      .then((data) => setMessages(data));
  };

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

      <div className="containerMember">
        <nav className="sidebarMember">
          <h2>Members online:</h2>
        </nav>
      </div>
    </>
  );
}