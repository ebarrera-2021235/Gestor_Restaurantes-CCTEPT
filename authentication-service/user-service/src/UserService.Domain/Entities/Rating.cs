using System;
using System.ComponentModel.DataAnnotations;

namespace UserService.Domain.Entities;

public class Rating
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(16)]
    public string UserId { get; set; } = string.Empty;

    [Required]
    public int RestaurantId { get; set; }

    [Required]
    [Range(1,5, ErrorMessage = "La puntuación debe estar entre 1 y 5.")]
    public int Score { get; set; }

    [MaxLength(500)]
    public string? Comment { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public User User { get; set; } = null!;
}