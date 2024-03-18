using System.ComponentModel.DataAnnotations.Schema;

namespace Models
{
    [Table("users")]
    public class User
    {
        [Column("id")]
        public int Id { get; set; }
        
        [Column("name")]
        public string Name { get; set; }
        
        [Column("user_name")]
        public string UserName { get; set; }
        
        [Column("about_me")]
        public string AboutMe { get; set; }

        [Column("profile_picture")]
        public string ProfilePicture { get; set; }

        public ICollection<Message> Messages { get; set; }

        public ICollection<UserChannel> UserChannels { get; set; }
        
        /* Later for Extensions  */
        /*
        public string Password { get; set; }
        public string Role { get; set; }
        */
    }
}
