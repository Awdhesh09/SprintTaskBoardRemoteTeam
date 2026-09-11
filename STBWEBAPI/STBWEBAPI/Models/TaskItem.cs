using System;
using System.ComponentModel.DataAnnotations;

namespace STBWEBAPI.Models
{
    public class TaskItem
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Title is required")]
        [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Assignee { get; set; } = string.Empty;
        [Required]
        [RegularExpression("Not Started|In Progress|Blocked|Done", ErrorMessage = "Status must be one of: Not Started, In Progress, Blocked, Done")]
        public string Status { get; set; } = string.Empty;
        public DateTime? DueDate { get; set; }
        public DateTime? CompletedAt { get; set; }
        public string Sprint { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
