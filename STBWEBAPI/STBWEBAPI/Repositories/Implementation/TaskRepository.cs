using Dapper;
using Microsoft.Data.SqlClient;
using STBWEBAPI.Data;
using STBWEBAPI.Models;
using STBWEBAPI.Repositories.Interface;
using STBWEBAPI.DTOs;
using System.Data;

namespace STBWEBAPI.Repositories.Implementation
{
    public class TaskRepository : ITaskRepository
    {
        private readonly ApplicationDbContext _context;

        public TaskRepository(ApplicationDbContext context)
        {
            _context = context;
        }

      
        // Get All Tasks - paged
        public async Task<PagedResult<TaskItem>> GetAllTasksAsync(int pageNumber, int pageSize)
        {
            using var conn = _context.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@PageNumber", pageNumber);
            parameters.Add("@PageSize", pageSize);            
            using var multi = await conn.QueryMultipleAsync("GetTasks", parameters, commandType: CommandType.StoredProcedure);
            var items = (await multi.ReadAsync<TaskItem>()).ToList();
            var total = await multi.ReadFirstOrDefaultAsync<int>();
            var result = new PagedResult<TaskItem>
            {
                Items = items,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalCount = total,
                TotalPages = (int)Math.Ceiling(total / (double)pageSize)
            };
            return result;
        }

        // Get Task By Id
        public async Task<TaskItem> GetTaskByIdAsync(int id)
        {
            using var conn = _context.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@Id", id);
            return await conn.QueryFirstOrDefaultAsync<TaskItem>("GetTaskById", parameters,commandType: CommandType.StoredProcedure);
        }

        //Insert Task
        public async Task<TaskItem> AddTaskAsync(TaskItem task)
        {
            using var conn = _context.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@Title", task.Title);
            parameters.Add("@Description", task.Description);
            parameters.Add("@Assignee", task.Assignee);
            parameters.Add("@Status", task.Status);
            parameters.Add("@DueDate", task.DueDate);
            parameters.Add("@Sprint", task.Sprint);
            await conn.ExecuteAsync("InsertTask", parameters, commandType: CommandType.StoredProcedure);
            return task;
        }

        // Update Task
        public async Task<TaskItem> UpdateTaskAsync(TaskItem task)
        {
            using var conn = _context.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@Id", task.Id);
            parameters.Add("@Title", task.Title);
            parameters.Add("@Description", task.Description);
            parameters.Add("@Assignee", task.Assignee);
            parameters.Add("@Status", task.Status);
            parameters.Add("@DueDate", task.DueDate);
            parameters.Add("@Sprint", task.Sprint);
            await conn.ExecuteAsync("UpdateTask", parameters, commandType: CommandType.StoredProcedure);
            return task;
        }

        // Delete Task
        public async Task<bool> DeleteTaskAsync(int id)
        {
            using var conn = _context.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@Id", id);
            var rows = await conn.ExecuteAsync("DeleteTask", parameters, commandType: CommandType.StoredProcedure);
            return rows > 0;
        }
    }
}
