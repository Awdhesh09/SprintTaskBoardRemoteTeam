using STBWEBAPI.DTOs;
using STBWEBAPI.Models;
using AutoMapper;
using STBWEBAPI.Repositories.Interface;
using STBWEBAPI.Services.Interface;

namespace STBWEBAPI.Services.Implementation
{
    public class TaskService : ITaskService
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;

        public TaskService(IUnitOfWork uow, IMapper mapper)
        {
            _uow = uow;
            _mapper = mapper;
        }

        public async Task<IEnumerable<TaskItem>> GetAllTasksAsync()
        {
            return await _uow.Tasks.GetAllTasksAsync();
        }

        public async Task<TaskItem> GetTaskByIdAsync(int id)
        {
            return await _uow.Tasks.GetTaskByIdAsync(id);
        }

        public async Task<TaskItem> CreateTaskAsync(CreateTaskDto dto)
        {
            var task = _mapper.Map<TaskItem>(dto);
            task.CreatedAt = DateTime.Now;
            task.CompletedAt = dto.Status == "Done" ? DateTime.Now : null;

            var created = await _uow.Tasks.AddTaskAsync(task);
            await _uow.SaveChangesAsync();
            return created;
        }

        public async Task<TaskItem> UpdateTaskAsync(UpdateTaskDto dto)
        {
            var task = await _uow.Tasks.GetTaskByIdAsync(dto.Id);
            if (task == null) return null;
            // map changed fields from dto onto existing entity
            _mapper.Map(dto, task);
            task.CompletedAt = dto.Status == "Done" ? DateTime.Now : null;

            var updated = await _uow.Tasks.UpdateTaskAsync(task);
            await _uow.SaveChangesAsync();
            return updated;
        }

        public async Task<bool> DeleteTaskAsync(int id)
        {
            var deleted = await _uow.Tasks.DeleteTaskAsync(id);
            await _uow.SaveChangesAsync();
            return deleted;
        }
    }

}
