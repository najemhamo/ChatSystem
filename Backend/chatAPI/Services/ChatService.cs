using System.Net.WebSockets;
using Models;
using System.Text.Json;
using System.Text;

namespace Services
{
    // Your ChatService implementation
    public class ChatService
    {
        private readonly List<WebSocket> _sockets = new();

        // Method to handle WebSocket connection and broadcast messages
        public async Task HandleWebSocketConnection(WebSocket socket)
        {
            _sockets.Add(socket);
            try
            {
                var buffer = new byte[1024 * 2];
                while (socket.State == WebSocketState.Open)
                {
                    var result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), default);
                    if (result.MessageType == WebSocketMessageType.Close)
                    {
                        await socket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, default);
                        break;
                    }

                    // Handle received message if needed

                    // Optionally, broadcast message to other clients
                    foreach (var s in _sockets.Where(s => s != socket && s.State == WebSocketState.Open))
                    {
                        await s.SendAsync(buffer[..result.Count], WebSocketMessageType.Text, true, default);
                    }
                }
            }
            finally
            {
                _sockets.Remove(socket);
                await socket.CloseAsync(WebSocketCloseStatus.NormalClosure, "WebSocket connection closed", default);
            }
        }

        // Method to send message to all connected clients
        public async Task SendMessageToClients(Message message)
        {
            var jsonMessage = JsonSerializer.Serialize(message);
            var buffer = new ArraySegment<byte>(Encoding.UTF8.GetBytes(jsonMessage));

            foreach (var socket in _sockets)
            {
                if (socket.State == WebSocketState.Open)
                {
                    await socket.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None);
                }
            }
        }
    }
}