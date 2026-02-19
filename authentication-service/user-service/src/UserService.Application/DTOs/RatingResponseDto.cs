namespace UserService.Application.DTOs;

public class RatingResponseDto
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public int RestaurantId { get; set; }
    public int Score { get; set; }
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; }
}