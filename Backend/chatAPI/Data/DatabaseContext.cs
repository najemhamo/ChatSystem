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