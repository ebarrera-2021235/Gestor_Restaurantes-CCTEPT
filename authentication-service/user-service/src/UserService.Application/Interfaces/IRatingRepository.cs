using UserService.Domain.Entities;

namespace UserService.Application.Interfaces;

public interface IRatingRepository
{
    Task<IEnumerable<Rating>> GetAllAsync();
    Task<Rating?> GetByIdAsync(int id);
    Task<IEnumerable<Rating>> GetByRestaurantAsync(int restaurantId);
    Task AddAsync(Rating rating);
    Task UpdateAsync(Rating rating);
    Task DeleteAsync(Rating rating);
}
