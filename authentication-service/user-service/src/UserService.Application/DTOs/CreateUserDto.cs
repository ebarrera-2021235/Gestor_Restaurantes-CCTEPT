namespace UserService.Application.DTOs;

public class CreateUserDto
{
    public string Nombre { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Contrasena { get; set; } = string.Empty;
    public int IdRol { get; set; }
}
