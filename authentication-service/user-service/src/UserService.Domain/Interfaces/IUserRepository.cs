using UserService.Domain.Entities;

namespace UserService.Domain.Interfaces;

public interface IUserRepository
{
    Task<IEnumerable<User>> GetAllAsync();
    Task<User?> GetByIdAsync(string id);
    
    // 🔐 NUEVOS MÉTODOS PARA SEGURIDAD
    Task<User?> GetByEmailAsync(string email);
    Task<bool> ExistsByEmailAsync(string email);

    Task AddAsync(User user);
    Task UpdateAsync(User user);
    Task DeleteAsync(User user);
}
