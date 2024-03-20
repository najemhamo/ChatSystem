using System.ComponentModel.DataAnnotations.Schema;

namespace Models
{
    [Table("messages")]
    public class Message
    {
        [Column("id")]
        public int Id { get; set; }
        
        [Column("member_id")]
        public int MemberId { get; set; }
        public Member Member { get; set; }

        [Column("channel_id")]
        public int ChannelId { get; set; }
        public Channel Channel { get; set; }
        
        [Column("message")]
        public string MessageText { get; set; }
        
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        


    }
}
