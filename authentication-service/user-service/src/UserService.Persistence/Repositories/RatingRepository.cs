using Microsoft.EntityFrameworkCore;
using UserService.Application.Interfaces;
using UserService.Domain.Entities;
using UserService.Persistence.Data;

namespace UserService.Persistence.Repositories;

public class RatingRepository : IRatingRepository
{
    private readonly ApplicationDbContext _context;

    public RatingRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Rating>> GetAllAsync()
        => await _context.Ratings
            .Include(r => r.User)
            .ToListAsync();

    public async Task<Rating?> GetByIdAsync(int id)
        => await _context.Ratings
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Id == id);

    public async Task<IEnumerable<Rating>> GetByRestaurantAsync(int restaurantId)
        => await _context.Ratings
            .Where(r => r.RestaurantId == restaurantId)
            .ToListAsync();

    public async Task AddAsync(Rating rating)
    {
        _context.Ratings.Add(rating);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Rating rating)
    {
        _context.Ratings.Update(rating);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Rating rating)
    {
        _context.Ratings.Remove(rating);
        await _context.SaveChangesAsync();
    }
}