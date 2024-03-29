import { useContext } from "react";
import { SocketContext } from "./HomePage";
import PropTypes from "prop-types";

export default function HomeSocketPage()
{
  const { socket, updateChannel, deleteChannel } = useContext(SocketContext);

  // Socket
  socket.onmessage = function (event) {
    const messageObj = JSON.parse(event.data);

    if (messageObj.type === "channelUpdate") {
      const updatedChannel = {
        name: messageObj.content,
        id: messageObj.id,
      };
      updateChannel({ updatedChannel });
    } else if (messageObj.type === "channelDelete") {
      deleteChannel({ id: messageObj.id });
    }
  };

  return <></>;
}

HomeSocketPage.propTypes = {
  socket: PropTypes.object.isRequired,
  updateChannel: PropTypes.func.isRequired,
  deleteChannel: PropTypes.func.isRequired,
};
