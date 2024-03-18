using System.ComponentModel.DataAnnotations.Schema;

namespace Models
{
    [Table("user_channels")]
    public class UserChannel
    {
        [Column("id")]
        public int Id { get; set; }
        
        [Column("user_id")]
        public int UserId { get; set; }
        public User User { get; set; }
        
        [Column("channel_id")]
        public int ChannelId { get; set; }
        public Channel Channel { get; set; }
    }
}