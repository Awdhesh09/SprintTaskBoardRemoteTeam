using STBWEBAPI.Repositories.Interface;
using STBWEBAPI.Models;

namespace STBWEBAPI.Repositories.Interface
{
    public interface IUnitOfWork : IDisposable
    {
        ITaskRepository Tasks { get; }
        Task<int> SaveChangesAsync();
    }
}
