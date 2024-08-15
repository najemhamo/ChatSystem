import { useContext } from "react";
import { SocketContext } from "./HomePage";
import PropTypes from "prop-types";

export default function HomeSocketPage()
{
  const { socket, updateChannel, deleteChannel } = useContext(SocketContext);

  // Socket
  socket.onmessage = function (event) {
    

    
  };

  return <></>;
}

HomeSocketPage.propTypes = {
  socket: PropTypes.object,
  updateChannel: PropTypes.func,
  deleteChannel: PropTypes.func,
};
