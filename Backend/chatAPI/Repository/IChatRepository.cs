using Endpoints;
using Models;

namespace Repository
{
    public enum PreloadPolicy
    {
        DoNotPreloadRelations,
        PreloadRelations
    }

    public interface IChatRepository
    {
        Task<IEnumerable<Channel>> GetChannels();
        Task<Channel> CreateChannel(CreateOrUpdateChannelPayload payload);
        Task<Channel> UpdateChannelById(int id, CreateOrUpdateChannelPayload payload);
        Task<Channel> DeleteChannelById(int id);
        Task<IEnumerable<Member>> GetMembers();        
        Task<Member> GetMemberById(int id, PreloadPolicy preloadPolicy = PreloadPolicy.DoNotPreloadRelations);
        Task<Member> CreateMember(CreateMemberPayload payload);
        Task<Member?> UpdateMemberById(int id, UpdateMemberPayload payload);
        Task<IEnumerable<Message>> GetMessagesByChannelId(int channelId, PreloadPolicy preloadPolicy = PreloadPolicy.DoNotPreloadRelations);
        Task<Message> CreateMessage(CreateMessagePayload payload);
        Task<Message> UpdateMessageById(int id, UpdateMessagePayload payload);
        Task<Message> DeleteMessageById(int id);
        public ApplicationUser? GetUser(string userName);
        Task<MemberChannel> AddMemberToChannel(int memberId, int channelId);
    }
}