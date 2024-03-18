using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using Models;

namespace DataContext
{
    public class DatabaseContext : DbContext
    {
       private string connectionString;

        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {
            var configuration = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
            connectionString = configuration.GetValue<string>("ConnectionStrings:DefaultConnectionString")!;
            this.Database.EnsureCreated();
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(connectionString);
            optionsBuilder.LogTo(message => Debug.WriteLine(message));     
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Define composite key.
            modelBuilder.Entity<UserChannel>().HasKey(uc => new { uc.UserId, uc.ChannelId });
            //modelBuilder.Entity<User>().HasMany(u => u.Messages).WithOne(m => m.User).HasForeignKey(m => m.UserId);

            // Seed Users data
            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, Name = "Philip Nina", UserName = "philip", AboutMe = "I am a software developer", ProfilePicture = "https://fastly.picsum.photos/id/6/5000/3333.jpg?hmac=pq9FRpg2xkAQ7J9JTrBtyFcp9-qvlu8ycAi7bUHlL7I" },
                new User { Id = 2, Name = "Carolin Svensson", UserName = "caro", AboutMe = "Follow me on Twitter", ProfilePicture = "https://fastly.picsum.photos/id/20/3670/2462.jpg?hmac=CmQ0ln-k5ZqkdtLvVO23LjVAEabZQx2wOaT4pyeG10I" },
                new User { Id = 3, Name = "Mattias Eriksson", UserName = "matt", AboutMe = "I am a photographer", ProfilePicture = "https://fastly.picsum.photos/id/29/4000/2670.jpg?hmac=rCbRAl24FzrSzwlR5tL-Aqzyu5tX_PA95VJtnUXegGU" },
                new User { Id = 4, Name = "Katarina Ida", UserName = "kata_ida", AboutMe = "Do you wanna be my next date?", ProfilePicture = "https://fastly.picsum.photos/id/65/4912/3264.jpg?hmac=uq0IxYtPIqRKinGruj45KcPPzxDjQvErcxyS1tn7bG0" }
            );
            // Seed Channels data
            modelBuilder.Entity<Channel>().HasData(
                new Channel { Id = 1, Name = "General" },
                new Channel { Id = 2, Name = "Memes" }
            );

            // Seed Messages data
            DateTime utc = DateTime.Now.ToUniversalTime();
            modelBuilder.Entity<Message>().HasData(
                new Message { Id = 1, UserId = 1, ChannelId = 1, MessageText = "Hello", CreatedAt = utc },
                new Message { Id = 2, UserId = 1, ChannelId = 1, MessageText = "Is anyone online?", CreatedAt = utc },
                new Message { Id = 3, UserId = 2, ChannelId = 1, MessageText = "Yo! Yes I am :)", CreatedAt = utc },
                new Message { Id = 4, UserId = 3, ChannelId = 1, MessageText = "Have you guys seen the new Memes channel?", CreatedAt = utc },
                new Message { Id = 5, UserId = 4, ChannelId = 1, MessageText = "Yeah, it's so cool!", CreatedAt = utc },

                new Message { Id = 6, UserId = 1, ChannelId = 2, MessageText = "What's a ninja's favorite type of shoes? Sneakers!", CreatedAt = utc },
                new Message { Id = 7, UserId = 2, ChannelId = 2, MessageText = "Haha", CreatedAt = utc },
                new Message { Id = 8, UserId = 3, ChannelId = 2, MessageText = "Lol", CreatedAt = utc },
                new Message { Id = 9, UserId = 4, ChannelId = 2, MessageText = "Lmao", CreatedAt = utc }
            );

            // Seed UserChannels data
            modelBuilder.Entity<UserChannel>().HasData(
                new UserChannel { UserId = 1, ChannelId = 1 },
                new UserChannel { UserId = 2, ChannelId = 1 },
                new UserChannel { UserId = 3, ChannelId = 1 },
                new UserChannel { UserId = 4, ChannelId = 1 },
                new UserChannel { UserId = 1, ChannelId = 2 },
                new UserChannel { UserId = 2, ChannelId = 2 },
                new UserChannel { UserId = 3, ChannelId = 2 },
                new UserChannel { UserId = 4, ChannelId = 2 }
            );
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Channel> Channels { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<UserChannel> UserChannels { get; set; }
    }
}