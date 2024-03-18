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
        // Get all users
       
        // Get user by id
        
        // PUT user by id
        
        // GET all messages

        // POST message

        // GET channels
        Task<IEnumerable<Channel>> GetChannels();
    }
}