namespace Endpoints
{
    public record UpdateUserPayload(string Name, string UserName, string AboutMe, string ProfilePicture);
    public record CreateMessagePayload(string MessageText, int UserId, int ChannelId);
}