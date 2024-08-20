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
        }

        public DbSet<Member> Members { get; set; }
        public DbSet<Channel> Channels { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<MemberChannel> MemberChannels { get; set; }

    }
}