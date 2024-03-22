import { useContext, useEffect, useState } from "react";
import { SocketContext, UserContext } from "../HomePage";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export default function MessageItem(props) {
  const { message, updateMessage, deleteMessage } = props;
  const { users } = useContext(UserContext);
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const messageUser = users.filter((urs) => message.memberId === urs.id)[0]
  // const messageUser = users[message.memberId - 2];

  const [buttonText, setButtonText] = useState("Edit");
  const [newMessage, setNewMessage] = useState([]);
  const [messageUpdate, setMessageUpdate] = useState({});
  const [messageDelete, setMessageDelete] = useState({});
  const navigate = useNavigate();
  const ownMessage =
    user && messageUser && user.id === messageUser.id ? true : false;

  // UPDATE message
  useEffect(() => {
    if (!messageUpdate.messageText) return;

    socket.send(
      JSON.stringify({
        type: "messageUpdate",
        content: messageUpdate.messageText,
        id: messageUpdate.id,
        memberid: messageUpdate.memberId,
        createdAt: messageUpdate.createdAt
      })
    );

    console.log("NEW MESS", messageUpdate)

    const putOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({messageText: messageUpdate.messageText}),
    };

    fetch(
      `http://localhost:5007/chat/messages/${messageUpdate.id}?id=${messageUpdate.id}`,
      putOptions
    );
  }, [messageUpdate]);

  // DELETE message
  useEffect(() => {
    if (!messageDelete.messageText) return;

    socket.send(
      JSON.stringify({ type: "messageDelete", content: "", id: message.id })
    );
    deleteMessage({ id: messageDelete.id });

    const deleteOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageDelete),
    };

    fetch(
      `http://localhost:5007/chat/messages/${message.id}?id=${message.id}`,
      deleteOptions
    );
  }, [messageDelete]);

  const handleEdit = () => {
    if (buttonText === "Save") {
      if (!newMessage.messageText || newMessage.messageText.length === 0) {
        setButtonText("Edit");
        return;
      }

      let updatedMessage = message;
      updatedMessage.messageText = newMessage.messageText;

      setMessageUpdate(updatedMessage);
      updateMessage({ updatedMessage });
      setNewMessage([]);
      setButtonText("Edit");
    } else setButtonText("Save");
  };

  const handleDelete = () => {
    setMessageDelete(message);
  };

  const handleInput = (event) => {
    setNewMessage({ messageText: event.target.value });
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      ></link>

      <div>

        <div className="userTime">
          <p
            className="usernameText"
            onClick={() => navigate(`/users/${messageUser.id}`)}
            >
            {messageUser && messageUser.userName}
          </p>
          <p className="time">{message.createdAt}</p>
        </div>

        <div>
          {buttonText === "Edit" && <p className={ownMessage ? "messageTexting textFix" : "messageTexting"}>{message && message.messageText}</p>}
          {buttonText === "Save" && <input className="messageTexting textFix" type="text" placeholder={message.messageText} onChange={handleInput}></input>}

          {/* <div> */}
            {ownMessage &&
            <>
              <button className="messageBth messageEdit" onClick={handleEdit}><i className="fa fa-bars"></i></button>
              <button className="messageBth" onClick={handleDelete}><i className="fa fa-trash"></i></button>
            </>}
          {/* </div> */}

        </div>


        {/* <div>
          {buttonText === "Edit" && (
            <p
              className={
                ownMessage ? "messageTexting textFix" : "messageTexting"
              }
            >
              {message && message.messageText}{" "}
              {ownMessage && (
                <i onClick={handleEdit} className="fa fa-bars faFix"></i>
              )}
              {ownMessage && (
                <i onClick={handleDelete} className="fa fa-trash faDix "></i>
              )}
            </p>
          )}
          {buttonText === "Save" && (
            <input
              className={
                ownMessage ? "messageTexting textFix" : "messageTexting"
              }
              type="text"
              placeholder={message.messageText}
              onChange={handleInput}
            ></input>
          )}
        </div> */}
      </div>
    </>
  );
}

MessageItem.propTypes = {
  message: PropTypes.object.isRequired,
  socket: PropTypes.object.isRequired,
  updateMessage: PropTypes.func.isRequired,
  deleteMessage: PropTypes.func.isRequired,
};
