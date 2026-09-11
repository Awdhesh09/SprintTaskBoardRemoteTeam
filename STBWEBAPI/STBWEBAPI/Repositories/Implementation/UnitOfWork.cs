using STBWEBAPI.Data;
using STBWEBAPI.Repositories.Interface;

namespace STBWEBAPI.Repositories.Implementation
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        private ITaskRepository _taskRepository;

        public UnitOfWork(ApplicationDbContext context, ITaskRepository taskRepository)
        {
            _context = context;
            _taskRepository = taskRepository;
        }

        public ITaskRepository Tasks => _taskRepository;

        public Task<int> SaveChangesAsync()
        {
            // Using Dapper with stored procedures; nothing to save on a context level.
            // If using transactions in future, implement transaction commit here.
            return Task.FromResult(0);
        }

        public void Dispose()
        {
            // ApplicationDbContext does not implement IDisposable; if switched to DbContext, dispose it here.
        }
    }
}