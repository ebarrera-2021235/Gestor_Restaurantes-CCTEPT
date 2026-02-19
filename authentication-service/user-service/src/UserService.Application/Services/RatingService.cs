using UserService.Application.DTOs;
using UserService.Application.Interfaces;
using UserService.Domain.Entities;

namespace UserService.Application.Services;

public class RatingService : IRatingService
{
    private readonly IRatingRepository _repository;

    public RatingService(IRatingRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<RatingResponseDto>> GetAllAsync()
    {
        var ratings = await _repository.GetAllAsync();

        return ratings.Select(r => new RatingResponseDto
        {
            Id = r.Id,
            UserId = r.UserId,
            RestaurantId = r.RestaurantId,
            Score = r.Score,
            Comment = r.Comment,
            CreatedAt = r.CreatedAt
        });
    }

    public async Task<RatingResponseDto?> GetByIdAsync(int id)
    {
        var rating = await _repository.GetByIdAsync(id);
        if (rating == null) return null;

        return new RatingResponseDto
        {
            Id = rating.Id,
            UserId = rating.UserId,
            RestaurantId = rating.RestaurantId,
            Score = rating.Score,
            Comment = rating.Comment,
            CreatedAt = rating.CreatedAt
        };
    }

    public async Task<RatingResponseDto> CreateAsync(CreateRatingDto dto)
    {
        var rating = new Rating
        {
            UserId = dto.UserId,
            RestaurantId = dto.RestaurantId,
            Score = dto.Score,
            Comment = dto.Comment
        };

        await _repository.AddAsync(rating);

        return new RatingResponseDto
        {
            Id = rating.Id,
            UserId = rating.UserId,
            RestaurantId = rating.RestaurantId,
            Score = rating.Score,
            Comment = rating.Comment,
            CreatedAt = rating.CreatedAt
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var rating = await _repository.GetByIdAsync(id);
        if (rating == null) return false;

        await _repository.DeleteAsync(rating);
        return true;
    }

    public async Task<double> GetAverageByRestaurantAsync(int restaurantId)
    {
        var ratings = await _repository.GetByRestaurantAsync(restaurantId);

        if (!ratings.Any())
            return 0;

        return ratings.Average(r => r.Score);
    }

    public async Task<int> GetTotalByUserAsync(string userId)
    {
        var ratings = await _repository.GetAllAsync();
        return ratings.Count(r => r.UserId == userId);
    }
}