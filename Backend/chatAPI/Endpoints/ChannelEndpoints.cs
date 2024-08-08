using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models;
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
            chat.MapGet("channels", GetAllChannels);
            chat.MapPost("channels", CreateChannel);
            chat.MapPut("channels/{id}", UpdateChannelById);
            chat.MapDelete("channels/{id}", DeleteChannelById);
            chat.MapGet("channels/{id}/messages", GetMessagesByChannelId);
            chat.MapGet("members", GetAllMembers);
            chat.MapGet("members/{id}", GetMemberById);
            chat.MapPut("members/{id}", UpdateMemberById);
            chat.MapPost("members/{memberID}/channels/{channelID}/message", CreateMessage);
            chat.MapPut("messages/{messageID}", UpdateMessageById);
            chat.MapDelete("messages/{messageID}", DeleteMessageById);
            chat.MapGet("reset", ResetDatabase);
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
        private static async Task<IResult> GetAllMembers(IChatRepository chatRepository)
        {
            var members = await chatRepository.GetMembers();
            return TypedResults.Ok(members);
        }

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        private static async Task<IResult> GetMemberById(IChatRepository chatRepository, int id)
        {
            var user = await chatRepository.GetMemberById(id);
            if (user == null)
            {
                return TypedResults.NotFound();
            }
            return TypedResults.Ok(user);
        }

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        private static async Task<IResult> UpdateMemberById(int id, IChatRepository chatRepository, UpdateMemberPayload payload)
        {
            if (string.IsNullOrEmpty(payload.UserName))
            {
                return TypedResults.BadRequest("User Name is required");
            }
            if (string.IsNullOrEmpty(payload.Name))
            {
                return TypedResults.BadRequest("Name is required");
            }
            var member = await chatRepository.UpdateMemberById(id, payload);
            if (member == null)
            {
                return TypedResults.NotFound();
            }
            return TypedResults.Ok(member);
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

        [Authorize(Roles = nameof(Roles.Admin))]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        private static async Task<IResult> CreateChannel(IChatRepository chatRepository, CreateOrUpdateChannelPayload payload)
        {
            if (string.IsNullOrEmpty(payload.Name))
            {
                return TypedResults.BadRequest("Channel Name is required");
            }
            var channel = await chatRepository.CreateChannel(payload);
            return TypedResults.Ok(channel);
        }

        [Authorize(Roles = nameof(Roles.Admin))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        private static async Task<IResult> UpdateChannelById(int id, IChatRepository chatRepository, CreateOrUpdateChannelPayload payload)
        {
            if (string.IsNullOrEmpty(payload.Name))
            {
                return TypedResults.BadRequest("Channel Name is required");
            }
            var channel = await chatRepository.UpdateChannelById(id, payload);
            if (channel == null)
            {
                return TypedResults.NotFound();
            }
            return TypedResults.Ok(channel);
        }

        [Authorize(Roles = nameof(Roles.Admin))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        private static async Task<IResult> DeleteChannelById(int id, IChatRepository chatRepository)
        {
            var channel = await chatRepository.DeleteChannelById(id);
            if (channel == null)
            {
                return TypedResults.NotFound();
            }
            return TypedResults.Ok(channel);
        }



        [ProducesResponseType(StatusCodes.Status200OK)]
        private static async Task<IResult> ResetDatabase(IChatRepository chatRepository)
        {
            await chatRepository.ResetDatabase();
            return TypedResults.Ok();
        }
    }
}