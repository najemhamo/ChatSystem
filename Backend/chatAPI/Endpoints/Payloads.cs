using Models;

namespace Endpoints
{
    public record CreateMemberPayload(string Name, string UserName, string Email, string Password, string AboutMe, string ProfilePicture, Roles Role);
    public record UpdateMemberPayload(string Name, string UserName, string AboutMe, string ProfilePicture);
    public record CreateMessagePayload(string MessageText, int MemberId, int ChannelId);
    public record UpdateMessagePayload(string MessageText);
    public record CreateOrUpdateChannelPayload(string Name);

    public record RegisterUserPayload(string Name, string UserName, string Email, string Password, string AboutMe, string ProfilePicture, Roles Role);
    public record LoginUserPayload(string UserName, string Password);
    public record AuthenticateUserResponse(string Token, string UserName, Roles Role);
}