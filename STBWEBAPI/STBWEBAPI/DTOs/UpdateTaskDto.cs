using System.ComponentModel.DataAnnotations;

namespace STBWEBAPI.DTOs
{
    public class UpdateTaskDto
    {
        [Required]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string Assignee { get; set; } = string.Empty;

        [Required]
        public string Status { get; set; } = string.Empty;

        public DateTime? DueDate { get; set; }

        public string Sprint { get; set; } = string.Empty;
    }
}
