namespace UserService.Application.DTOs;

public class UpdateUserDto
{
    public string Nombre { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int IdRol { get; set; }
}
