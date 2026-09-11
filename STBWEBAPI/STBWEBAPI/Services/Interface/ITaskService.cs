using STBWEBAPI.DTOs;
using STBWEBAPI.Models;

namespace STBWEBAPI.Services.Interface
{
    public interface ITaskService
    {
        Task<IEnumerable<TaskItem>> GetAllTasksAsync();
        Task<TaskItem> GetTaskByIdAsync(int id);
        Task<TaskItem> CreateTaskAsync(CreateTaskDto dto);
        Task<TaskItem> UpdateTaskAsync(UpdateTaskDto dto);
        Task<bool> DeleteTaskAsync(int id);
    }
}
