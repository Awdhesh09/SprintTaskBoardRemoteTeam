using STBWEBAPI.Models;
using STBWEBAPI.DTOs;

namespace STBWEBAPI.Repositories.Interface
{
    public interface ITaskRepository
    {
     
        Task<PagedResult<TaskItem>> GetAllTasksAsync(int pageNumber, int pageSize);
        Task<TaskItem> GetTaskByIdAsync(int id);
        Task<TaskItem> AddTaskAsync(TaskItem task);
        Task<TaskItem> UpdateTaskAsync(TaskItem task);
        Task<bool> DeleteTaskAsync(int id);
    }
}
