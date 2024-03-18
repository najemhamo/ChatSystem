using Microsoft.EntityFrameworkCore;
using Models;
using DataContext;

namespace Repository
{
    public class ChatRepository : IChatRepository
    {
        private DatabaseContext _context;

        public ChatRepository(DatabaseContext db)
        {
            _context = db;
        }

        public async Task<IEnumerable<Channel>> GetChannels()
        {
            return await _context.Channels.ToListAsync();
        }

        public async Task<IEnumerable<User>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User> GetUserById(int id, PreloadPolicy preloadPolicy = PreloadPolicy.DoNotPreloadRelations)
        {
            if (preloadPolicy == PreloadPolicy.PreloadRelations)
            {
                var user = await _context.Users
                    .Include(u => u.Messages)
                    .Include(u => u.UserChannels)
                    .FirstOrDefaultAsync(u => u.Id == id);

                if (user != null)
                {
                    return user;
                }
            }
            else
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);

                if (user != null)
                {
                    return user;
                }
            }

            // Return null if user is not found
            return null;
        }
    }

}