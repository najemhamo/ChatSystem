using System.ComponentModel.DataAnnotations.Schema;

namespace Models
{
    [Table("members")]
    public class Member
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("user_name")]
        public string UserName { get; set; }

        [Column("email")]
        public string Email { get; set; }

        [Column("password")]
        public string Password { get; set; }

        [Column("about_me")]
        public string AboutMe { get; set; }

        [Column("profile_picture")]
        public string ProfilePicture { get; set; }

        [Column("role")]
        public Roles Role { get; set; }

        public ICollection<Message> Messages { get; set; }

        public ICollection<MemberChannel> MemberChannels { get; set; }
    }
}
