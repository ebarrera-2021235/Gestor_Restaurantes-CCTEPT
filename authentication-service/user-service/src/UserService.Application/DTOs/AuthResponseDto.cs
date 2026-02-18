namespace UserService.Application.DTOs;

public class AuthResponseDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public UserResponseDto? User { get; set; }
}
