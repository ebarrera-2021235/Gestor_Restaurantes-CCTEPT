using Microsoft.EntityFrameworkCore;
using UserService.Domain.Interfaces;
using UserService.Domain.Entities;
using UserService.Persistence.Data;

namespace UserService.Persistence.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<User>> GetAllAsync()
    {
        return await _context.Users
            .Include(u => u.UserRoles) 
            .ThenInclude(ur => ur.Role)   
            .AsNoTracking()
            .ToListAsync();
    }


    public async Task<User?> GetByIdAsync(string id)
    {
        return await _context.Users
            .Include(u => u.UserRoles) 
            .ThenInclude(ur => ur.Role) 
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.IdUsuario == id);
    }


    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users
            .Include(u => u.UserRoles)  
            .ThenInclude(ur => ur.Role) 
            .FirstOrDefaultAsync(u => u.Email == email);
    }


    public async Task<bool> ExistsByEmailAsync(string email)
    {
        return await _context.Users
            .AnyAsync(u => u.Email == email);
    }

    public async Task AddAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(User user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(User user)
    {
        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
    }
}