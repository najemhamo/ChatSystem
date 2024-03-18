using Microsoft.AspNetCore.Mvc;
using Repository;

namespace Endpoints
{
    public static class ChannelEndpoints
    {
    public static void ConfigureChannelEndpoints(this WebApplication app)
    {
        var chat = app.MapGroup("/chat");

        chat.MapGet("/channels", GetAllChannels);
        chat.MapGet("channels/{id}/messages", GetMessagesByChannelId);
        chat.MapGet("/users", GetAllUsers);
        chat.MapGet("/user/{id}", GetUserById);
        chat.MapPut("/user/{id}", UpdateUserById);
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
}
}