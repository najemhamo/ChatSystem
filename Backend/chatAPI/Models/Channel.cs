using System.ComponentModel.DataAnnotations.Schema;

namespace Models
{
    [Table("channels")]
    public class Channel
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("name")]
        public string Name { get; set; }

        public ICollection<Message> Messages { get; set; }
        public ICollection<MemberChannel> MemberChannels { get; set; }
    }
}
