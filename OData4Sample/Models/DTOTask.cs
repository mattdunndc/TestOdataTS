using System.ComponentModel.DataAnnotations;

namespace OData4Sample.Models
{
    public class DTOTask
    {
        [Key]
        public int Id { get; set; }
        public string TaskName { get; set; }
        public bool IsComplete { get; set; }
    }
}
