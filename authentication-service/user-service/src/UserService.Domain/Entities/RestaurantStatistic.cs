using System;
using System.ComponentModel.DataAnnotations;

namespace UserService.Domain.Entities;

public class RestaurantStatistic
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int RestaurantId { get; set; }

    public DateTime Date { get; set; } = DateTime.UtcNow;

    public int TotalReservations { get; set; }

    public int TotalOrders { get; set; }

    public decimal TotalRevenue { get; set; }
}