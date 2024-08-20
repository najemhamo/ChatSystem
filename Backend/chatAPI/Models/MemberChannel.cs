using System.ComponentModel.DataAnnotations.Schema;

namespace Models
{
    [Table("member_channels")]
    public class MemberChannel
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("member_id")]
        public int MemberId { get; set; }

        [Column("channel_id")]
        public int ChannelId { get; set; }

        public Member Member { get; set; }
        public Channel Channel { get; set; }
    }
}