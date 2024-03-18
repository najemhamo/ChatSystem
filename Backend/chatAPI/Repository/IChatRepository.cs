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

        // PUT user by id
        Task<User?> UpdateUserById(int id, UpdateUserPayload payload);

        // GET all messages in a specific channel
        Task<IEnumerable<Message>> GetMessagesByChannelId(int channelId, PreloadPolicy preloadPolicy = PreloadPolicy.DoNotPreloadRelations);

        // POST message

    }
}