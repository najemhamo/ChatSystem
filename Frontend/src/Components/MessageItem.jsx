import { useContext, useState } from "react";
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

  const [buttonText, setButtonText] = useState("Edit");
  const navigate = useNavigate();
  const ownMessage =
    user && messageUser && user.id === messageUser.id ? true : false;


  const handleEdit = () =>
  {
    if (buttonText === "Save")
    {
      // Create the new message
      const newMessage = document.getElementById("editedMessage").value    
      if (newMessage.length === 0)
      {
        setButtonText("Edit");
        return;
      }
      message.messageText = newMessage
      const updatedMessage = message


      // Websocket update message
      socket.send(
        JSON.stringify({
        type: "messageUpdate",
        content: newMessage,
        id: message.id,
        memberid: message.memberId,
        createdAt: message.createdAt
        })
      )
    

      // UPDATE the message
      const putOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({messageText: newMessage}),
      }

      fetch(`http://localhost:5007/chat/messages/${message.id}?id=${message.id}`, putOptions)
      updateMessage({ updatedMessage });
      setButtonText("Edit");
    } else setButtonText("Save");
  };


  const handleDelete = () => {
    
    // Delete message Websocket
    socket.send(
      JSON.stringify({ type: "messageDelete", id: message.id })
    );
    deleteMessage({ id: message.id });


    // DELETE message
    const deleteOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message.id),
    };

    fetch(
      `http://localhost:5007/chat/messages/${message.id}?id=${message.id}`,
      deleteOptions
    );
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
          {buttonText === "Save" && <input className="messageTexting textFix" id="editedMessage" type="text" name="editedMessage" defaultValue={message.messageText}></input>}

            {ownMessage &&
            <>
              <button className="messageBth messageEdit" onClick={handleEdit}><i className="fa fa-bars"></i></button>
              <button className="messageBth" onClick={handleDelete}><i className="fa fa-trash"></i></button>
            </>}

        </div>
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
