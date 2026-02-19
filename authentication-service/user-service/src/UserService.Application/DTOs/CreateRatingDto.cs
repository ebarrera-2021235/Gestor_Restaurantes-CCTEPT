namespace UserService.Application.DTOs;

public class CreateRatingDto
{
    public string UserId { get; set; } = string.Empty;
    public int RestaurantId { get; set; }
    public int Score { get; set; }
    public string? Comment { get; set; }
}