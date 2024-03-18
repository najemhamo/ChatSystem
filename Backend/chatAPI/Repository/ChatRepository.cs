using Microsoft.EntityFrameworkCore;
using Models;
using DataContext;
using Endpoints;

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

        public async Task<User?> UpdateUserById(int id, UpdateUserPayload payload)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            
            // Check if user is null or if any of the payload fields are empty
            if (user == null || string.IsNullOrEmpty(payload.UserName) || string.IsNullOrEmpty(payload.Name))
            {
                return null;
            }

            // Update user fields
            if (user != null)
            {
                user.Name = payload.Name;
                user.UserName = payload.UserName;
                user.AboutMe = payload.AboutMe;
                user.ProfilePicture = payload.ProfilePicture;

                await _context.SaveChangesAsync();

                return user;
            }

            return null;
        }

        public async Task<IEnumerable<Message>> GetMessagesByChannelId(int channelId, PreloadPolicy preloadPolicy = PreloadPolicy.DoNotPreloadRelations)
        {
            if (preloadPolicy == PreloadPolicy.PreloadRelations)
            {
                return await _context.Messages
                    .Include(m => m.User)
                    .Where(m => m.ChannelId == channelId)
                    .ToListAsync();
            }
            else
            {
                return await _context.Messages
                    .Where(m => m.ChannelId == channelId)
                    .ToListAsync();
            }
        }

        public async Task<Message> CreateMessage(CreateMessagePayload payload)
        {
            DateTime utc = DateTime.Now.ToUniversalTime();
            var message = new Message
            {
                MessageText = payload.MessageText,
                UserId = payload.UserId,
                ChannelId = payload.ChannelId
            };

            await _context.Messages.AddAsync(message);
            await _context.SaveChangesAsync();

            return message;
        }
    
    }
}