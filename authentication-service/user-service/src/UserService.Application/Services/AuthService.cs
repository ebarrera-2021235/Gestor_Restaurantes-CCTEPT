using UserService.Application.DTOs;
using UserService.Application.Interfaces;
using UserService.Domain.Interfaces;

namespace UserService.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _repository;
    private readonly IPasswordHashService _passwordHashService;

    public AuthService(IUserRepository repository, IPasswordHashService passwordHashService)
    {
        _repository = repository;
        _passwordHashService = passwordHashService;
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await _repository.GetByEmailAsync(dto.Email);

        if (user == null)
        {
            return new AuthResponseDto
            {
                Success = false,
                Message = "Credenciales inválidas"
            };
        }

        var isValid = _passwordHashService.VerifyPassword(dto.Contrasena, user.Contrasena);

        if (!isValid)
        {
            return new AuthResponseDto
            {
                Success = false,
                Message = "Credenciales inválidas"
            };
        }

        return new AuthResponseDto
        {
            Success = true,
            Message = "Login exitoso",
            User = new UserResponseDto
            {
                IdUsuario = user.IdUsuario,
                Nombre = user.Nombre,
                Email = user.Email,
                FechaCreacion = user.FechaCreacion,
                IdRol = user.IdRol
            }
        };
    }
}
