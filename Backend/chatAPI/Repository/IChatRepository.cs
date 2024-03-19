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
        Task<IEnumerable<User>> GetUsers();        
        Task<User> GetUserById(int id, PreloadPolicy preloadPolicy = PreloadPolicy.DoNotPreloadRelations);
        Task<User?> UpdateUserById(int id, UpdateUserPayload payload);
        Task<IEnumerable<Message>> GetMessagesByChannelId(int channelId, PreloadPolicy preloadPolicy = PreloadPolicy.DoNotPreloadRelations);
        Task<Message> CreateMessage(CreateMessagePayload payload);
        Task<Message> UpdateMessageById(int id, UpdateMessagePayload payload);
        Task<Message> DeleteMessageById(int id);
    }
}