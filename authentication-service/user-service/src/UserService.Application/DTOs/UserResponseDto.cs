namespace UserService.Application.DTOs;

public class UserResponseDto
{
    public string IdUsuario { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime FechaCreacion { get; set; }
    public int IdRol { get; set; }
}
