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
        Task<IEnumerable<User>> GetUsers();        
        Task<User> GetUserById(int id, PreloadPolicy preloadPolicy = PreloadPolicy.DoNotPreloadRelations);
        Task<User?> UpdateUserById(int id, UpdateUserPayload payload);
        Task<IEnumerable<Message>> GetMessagesByChannelId(int channelId, PreloadPolicy preloadPolicy = PreloadPolicy.DoNotPreloadRelations);
        Task<Message> CreateMessage(CreateMessagePayload payload);

    }
}