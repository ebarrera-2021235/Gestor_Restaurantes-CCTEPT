using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserService.Application.DTOs;
using UserService.Application.Interfaces;

namespace UserService.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class RatingsController : ControllerBase
{
    private readonly IRatingService _service;

    public RatingsController(IRatingService service)
    {
        _service = service;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAll()
        => Ok(await _service.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var rating = await _service.GetByIdAsync(id);
        if (rating == null) return NotFound();

        return Ok(rating);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateRatingDto dto)
    {
        var result = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteAsync(id);
        if (!deleted) return NotFound();

        return NoContent();
    }

    [HttpGet("average/{restaurantId}")]
    public async Task<IActionResult> GetAverage(int restaurantId)
        => Ok(await _service.GetAverageByRestaurantAsync(restaurantId));

    [HttpGet("count/user/{userId}")]
    public async Task<IActionResult> GetUserCount(string userId)
        => Ok(await _service.GetTotalByUserAsync(userId));
}