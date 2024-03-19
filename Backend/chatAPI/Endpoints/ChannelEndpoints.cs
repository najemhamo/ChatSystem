using System.Data;
using Microsoft.AspNetCore.Mvc;
using Repository;
using Services;

namespace Endpoints
{
    public static class ChannelEndpoints
    {
        public static void ConfigureChannelEndpoints(this WebApplication app)
        {
            var chat = app.MapGroup("/chat");

            chat.MapGet("/", GetConnection);
            chat.MapGet("/channels", GetAllChannels);
            chat.MapGet("channels/{id}/messages", GetMessagesByChannelId);
            chat.MapGet("/users", GetAllUsers);
            chat.MapGet("/users/{id}", GetUserById);
            chat.MapPut("/users/{id}", UpdateUserById);
            chat.MapPost("users/{userID}/channels/{channelID}/message", CreateMessage);
            chat.MapPut("/messages/{messageID}", UpdateMessageById);
            chat.MapDelete("/messages/{messageID}", DeleteMessageById);
        }

        private static async Task GetConnection(HttpContext context, ChatService chatService)
        {
            if (context.WebSockets.IsWebSocketRequest)
            {
                var webSocket = await context.WebSockets.AcceptWebSocketAsync();
                await chatService.HandleWebSocketConnection(webSocket);
            }
            else
            {
                context.Response.StatusCode = 400;
                await context.Response.WriteAsync("Expected a WebSocket request");
            }
        }


        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        private static async Task<IResult> GetAllChannels(IChatRepository chatRepository)
        {
            var channels = await chatRepository.GetChannels();
            return TypedResults.Ok(channels);
        }

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        private static async Task<IResult> GetAllUsers(IChatRepository chatRepository)
        {
            var users = await chatRepository.GetUsers();
            return TypedResults.Ok(users);
        }

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        private static async Task<IResult> GetUserById(IChatRepository chatRepository, int id)
        {
            var user = await chatRepository.GetUserById(id);
            if (user == null)
            {
                return TypedResults.NotFound();
            }
            return TypedResults.Ok(user);
        }

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        private static async Task<IResult> UpdateUserById(int id, IChatRepository chatRepository, UpdateUserPayload payload)
        {
            if (string.IsNullOrEmpty(payload.UserName))
            {
                return TypedResults.BadRequest("User Name is required");
            }
            if (string.IsNullOrEmpty(payload.Name))
            {
                return TypedResults.BadRequest("Name is required");
            }
            var user = await chatRepository.UpdateUserById(id, payload);
            if (user == null)
            {
                return TypedResults.NotFound();
            }
            return TypedResults.Ok(user);
        }


        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        private static async Task<IResult> GetMessagesByChannelId(IChatRepository chatRepository, int id)
        {
            var messages = await chatRepository.GetMessagesByChannelId(id);
            if (messages == null)
            {
                return TypedResults.NotFound();
            }
            return TypedResults.Ok(messages);
        }

        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        private static async Task<IResult> CreateMessage(IChatRepository chatRepository, CreateMessagePayload payload, ChatService chatService)
        {
            var message = await chatRepository.CreateMessage(payload);
            await chatService.SendMessageToClients(message);
            return TypedResults.Ok(message);
        }

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        private static async Task<IResult> UpdateMessageById(int id, IChatRepository chatRepository, UpdateMessagePayload payload, ChatService chatService)
        {
            var message = await chatRepository.UpdateMessageById(id, payload);
            if (message == null)
            {
                return TypedResults.NotFound();
            }
            await chatService.SendMessageToClients(message);
            return TypedResults.Ok(message);
        }

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        private static async Task<IResult> DeleteMessageById(int id, IChatRepository chatRepository, ChatService chatService)
        {
            var message = await chatRepository.DeleteMessageById(id);
            if (message == null)
            {
                return TypedResults.NotFound();
            }
            await chatService.SendMessageToClients(message);
            return TypedResults.Ok(message);
        }
    }
}