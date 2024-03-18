using Microsoft.AspNetCore.Mvc;
using Repository;

namespace Endpoints
{
    public static class ChannelEndpoints
    {
    public static void ConfigureChannelEndpoints(this WebApplication app)
    {
        var chat = app.MapGroup("/chat");

        chat.MapPost("/channels", GetAllChannels);

    }

    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    private static async Task<IResult> GetAllChannels(IChatRepository chatRepository)
    {
        var channels = await chatRepository.GetChannels();
        return TypedResults.Ok(channels);
    }

}
}