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

        public async Task<IEnumerable<Member>> GetMembers()
        {
            return await _context.Members.ToListAsync();
        }

        public async Task<Member> GetMemberById(int id, PreloadPolicy preloadPolicy = PreloadPolicy.DoNotPreloadRelations)
        {
            if (preloadPolicy == PreloadPolicy.PreloadRelations)
            {
                var member = await _context.Members
                    .Include(u => u.Messages)
                    .Include(u => u.MemberChannels)
                    .FirstOrDefaultAsync(u => u.Id == id);

                if (member != null)
                {
                    return member;
                }
            }
            else
            {
                var member = await _context.Members.FirstOrDefaultAsync(u => u.Id == id);

                if (member != null)
                {
                    return member;
                }
            }

            // Return null if member is not found
            return null;
        }

        public async Task<Member?> UpdateMemberById(int id, UpdateMemberPayload payload)
        {
            var member = await _context.Members.FirstOrDefaultAsync(u => u.Id == id);

            // Check if member is null or if any of the payload fields are empty
            if (member == null || string.IsNullOrEmpty(payload.UserName) || string.IsNullOrEmpty(payload.Name))
            {
                return null;
            }

            // Update member fields
            if (member != null)
            {
                member.Name = payload.Name;
                member.UserName = payload.UserName;
                member.AboutMe = payload.AboutMe;
                member.ProfilePicture = payload.ProfilePicture;

                await _context.SaveChangesAsync();

                return member;
            }

            return null;
        }

        public async Task<IEnumerable<Message>> GetMessagesByChannelId(int channelId, PreloadPolicy preloadPolicy = PreloadPolicy.DoNotPreloadRelations)
        {
            if (preloadPolicy == PreloadPolicy.PreloadRelations)
            {
                return await _context.Messages
                    .Include(m => m.Member)
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
                MemberId = payload.MemberId,
                ChannelId = payload.ChannelId
            };

            await _context.Messages.AddAsync(message);
            await _context.SaveChangesAsync();

            return message;
        }

        public async Task<Message> UpdateMessageById(int id, UpdateMessagePayload payload)
        {
            var message = await _context.Messages.FirstOrDefaultAsync(m => m.Id == id);

            if (message != null)
            {
                message.MessageText = payload.MessageText;
                await _context.SaveChangesAsync();
                return message;
            }

            return null;
        }

        public async Task<Message> DeleteMessageById(int id)
        {
            var message = await _context.Messages.FirstOrDefaultAsync(m => m.Id == id);

            if (message != null)
            {
                _context.Messages.Remove(message);
                await _context.SaveChangesAsync();
                return message;
            }

            return null;
        }

        public async Task<Channel> CreateChannel(CreateOrUpdateChannelPayload payload)
        {
            var channel = new Channel
            {
                Name = payload.Name
            };

            await _context.Channels.AddAsync(channel);
            await _context.SaveChangesAsync();

            return channel;
        }

        public async Task<Channel> UpdateChannelById(int id, CreateOrUpdateChannelPayload payload)
        {
            var channel = await _context.Channels.FirstOrDefaultAsync(c => c.Id == id);

            if (channel != null)
            {
                channel.Name = payload.Name;
                await _context.SaveChangesAsync();
                return channel;
            }

            return null;
        }

        public async Task<Channel> DeleteChannelById(int id)
        {
            var channel = await _context.Channels.FirstOrDefaultAsync(c => c.Id == id);

            if (channel != null)
            {
                _context.Channels.Remove(channel);
                await _context.SaveChangesAsync();
                return channel;
            }

            return null;
        }

        public ApplicationUser? GetUser(string userName)
        {
            return _context.Users.FirstOrDefault(u => u.UserName == userName);
        }

        public async Task<MemberChannel> AddMemberToChannel(int memberId, int channelId)
        {
            var memberChannel = new MemberChannel
            {
                MemberId = memberId,
                ChannelId = channelId
            };

            await _context.MemberChannels.AddAsync(memberChannel);
            await _context.SaveChangesAsync();

            return memberChannel;
        }
        public async Task<Member> CreateMember(CreateMemberPayload payload)
        {
            var member = new Member
            {
                Name = payload.Name,
                UserName = payload.UserName,
                Email = payload.Email,
                Password = payload.Password,
                AboutMe = payload.AboutMe,
                ProfilePicture = payload.ProfilePicture,
                Role = payload.Role
            };

            await _context.Members.AddAsync(member);
            await _context.SaveChangesAsync();

            // Get all channels from the database
            var channels = await _context.Channels.ToListAsync();

            // Add the new member to all channels
            foreach (var channel in channels)
            {
                await AddMemberToChannel(member.Id, channel.Id);
            }
            return member;
        }

    }
}
