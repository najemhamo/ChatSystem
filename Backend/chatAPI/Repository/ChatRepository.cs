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
    }

}