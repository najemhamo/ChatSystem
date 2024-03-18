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
        
        // GET all messages

        // POST message

    }
}