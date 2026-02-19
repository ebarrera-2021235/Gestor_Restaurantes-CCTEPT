using UserService.Domain.Entities;
using UserService.Application.DTOs;

namespace UserService.Application.Interfaces;

public interface IRatingService
{
    Task<IEnumerable<RatingResponseDto>> GetAllAsync();
    Task<RatingResponseDto?> GetByIdAsync(int id);
    Task<RatingResponseDto> CreateAsync(CreateRatingDto dto);
    Task<bool> DeleteAsync(int id);

    Task<double> GetAverageByRestaurantAsync(int restaurantId);
    Task<int> GetTotalByUserAsync(string userId);
}
