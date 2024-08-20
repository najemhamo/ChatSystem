using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Models;
using Microsoft.AspNetCore.Identity;

namespace DataContext
{
    public class DatabaseContext : IdentityUserContext<ApplicationUser>
    {

        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            DateTime utc = DateTime.Now.ToUniversalTime();

            // Define composite key.
            modelBuilder.Entity<MemberChannel>().HasKey(uc => new { uc.MemberId, uc.ChannelId });

            // Seed Users data
            modelBuilder.Entity<Member>().HasData(
                new Member { Id = 1, Name = "Philip Nina", UserName = "philip", Email = "philip@example.com", Password = "Chat123", AboutMe = "I am a software developer", ProfilePicture = "https://fastly.picsum.photos/id/6/5000/3333.jpg?hmac=pq9FRpg2xkAQ7J9JTrBtyFcp9-qvlu8ycAi7bUHlL7I", Role = Roles.Member },
                new Member { Id = 2, Name = "Carolin Svensson", UserName = "caro", Email = "caro@example.com", Password = "Chat123", AboutMe = "Follow me on Twitter", ProfilePicture = "https://fastly.picsum.photos/id/20/3670/2462.jpg?hmac=CmQ0ln-k5ZqkdtLvVO23LjVAEabZQx2wOaT4pyeG10I", Role = Roles.Member },
                new Member { Id = 3, Name = "Mattias Eriksson", UserName = "matt", Email = "matt@example.com", Password = "Chat123", AboutMe = "I am a photographer", ProfilePicture = "https://fastly.picsum.photos/id/29/4000/2670.jpg?hmac=rCbRAl24FzrSzwlR5tL-Aqzyu5tX_PA95VJtnUXegGU", Role = Roles.Member },
                new Member { Id = 4, Name = "Katarina Ida", UserName = "kata_ida", Email = "kata_ida@example.com", Password = "Chat123", AboutMe = "Do you wanna be my next date?", ProfilePicture = "https://fastly.picsum.photos/id/65/4912/3264.jpg?hmac=uq0IxYtPIqRKinGruj45KcPPzxDjQvErcxyS1tn7bG0", Role = Roles.Member },
                 new Member { Id = 5, Name = "Admin", UserName = "admin", Email = "admin@example.com", Password = "Chat123", AboutMe = "I am an admin", ProfilePicture = "", Role = Roles.Admin }
            );

            // Seed Channels data
            modelBuilder.Entity<Channel>().HasData(
                new Channel { Id = 1, Name = "General" },
                new Channel { Id = 2, Name = "Memes" },
                new Channel { Id = 3, Name = "Study" },
                new Channel { Id = 4, Name = "Random" }
            );


<<<<<<< HEAD

            /*
            // Seed Messages data
            modelBuilder.Entity<Message>().HasData(
                new Message { Id = 1, MemberId = 1, ChannelId = 1, MessageText = "Hello", CreatedAt = utc },
                new Message { Id = 2, MemberId = 1, ChannelId = 1, MessageText = "Is anyone online?", CreatedAt = utc },
                new Message { Id = 3, MemberId = 2, ChannelId = 1, MessageText = "Yo! Yes I am :)", CreatedAt = utc },
                new Message { Id = 4, MemberId = 3, ChannelId = 1, MessageText = "Have you guys seen the new Memes channel?", CreatedAt = utc },
                new Message { Id = 5, MemberId = 4, ChannelId = 1, MessageText = "Yeah, it's so cool!", CreatedAt = utc },

                new Message { Id = 6, MemberId = 1, ChannelId = 2, MessageText = "What's a ninja's favorite type of shoes? Sneakers!", CreatedAt = utc },
                new Message { Id = 7, MemberId = 2, ChannelId = 2, MessageText = "Haha", CreatedAt = utc },
                new Message { Id = 8, MemberId = 3, ChannelId = 2, MessageText = "Lol", CreatedAt = utc },
                new Message { Id = 9, MemberId = 4, ChannelId = 2, MessageText = "Lmao", CreatedAt = utc }
            );
            */
            /*
            // Seed MemberChannels data
            modelBuilder.Entity<MemberChannel>().HasData(
                new MemberChannel { MemberId = 1, ChannelId = 1 },
                new MemberChannel { MemberId = 2, ChannelId = 1 },
                new MemberChannel { MemberId = 3, ChannelId = 1 },
                new MemberChannel { MemberId = 4, ChannelId = 1 },
                new MemberChannel { MemberId = 1, ChannelId = 2 },
                new MemberChannel { MemberId = 2, ChannelId = 2 },
                new MemberChannel { MemberId = 3, ChannelId = 2 },
                new MemberChannel { MemberId = 4, ChannelId = 2 },
                new MemberChannel { MemberId = 1, ChannelId = 3 },
                new MemberChannel { MemberId = 2, ChannelId = 3 },
                new MemberChannel { MemberId = 3, ChannelId = 3 },
                new MemberChannel { MemberId = 4, ChannelId = 3 },
                new MemberChannel { MemberId = 1, ChannelId = 4 },
                new MemberChannel { MemberId = 2, ChannelId = 4 },
                new MemberChannel { MemberId = 3, ChannelId = 4 },
                new MemberChannel { MemberId = 4, ChannelId = 4 }
            );
            */

            /*
            // Seed Users data with roles
            var usersAccounts = modelBuilder.Entity<ApplicationUser>();
            var hasher = new PasswordHasher<ApplicationUser>();
<<<<<<< HEAD

=======
            */

            /*
>>>>>>> main
            // Seed Admin
            var adminUser = new ApplicationUser
            {
                Id = "admin-id",
                UserName = "admin",
                NormalizedUserName = "ADMIN@EXAMPLE.COM",
                Email = "admin@example.com",
                NormalizedEmail = "ADMIN@EXAMPLE.COM",
                Role = Roles.Admin // Assigning the admin role
            };
            adminUser.PasswordHash = hasher.HashPassword(adminUser, "Chat123");
            usersAccounts.HasData(adminUser);
            */
=======
>>>>>>> 67-backend---cors-policy
        }

        public DbSet<Member> Members { get; set; }
        public DbSet<Channel> Channels { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<MemberChannel> MemberChannels { get; set; }

    }
}