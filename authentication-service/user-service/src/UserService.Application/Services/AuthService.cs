using UserService.Application.DTOs;
using UserService.Application.Interfaces;
using UserService.Domain.Entities;
using UserService.Domain.Interfaces;

namespace UserService.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHashService _passwordHashService;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public AuthService(
        IUserRepository userRepository,
        IPasswordHashService passwordHashService,
        IJwtTokenGenerator jwtTokenGenerator)
    {
        _userRepository = userRepository;
        _passwordHashService = passwordHashService;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        var existingUser = await _userRepository.GetByEmailAsync(dto.Email);
        if (existingUser != null)
            throw new Exception("User already exists");

        var user = new User
        {
            IdUsuario = Guid.NewGuid().ToString("N").Substring(0, 16),
            Email = dto.Email,
            Nombre = dto.Email, // temporal si no tienes nombre en DTO
            Contrasena = _passwordHashService.HashPassword(dto.Password),
            IdRol = 2 // Asumimos 2 = User normal (ajústalo si necesario)
        };

        await _userRepository.AddAsync(user);

        var token = _jwtTokenGenerator.GenerateToken(
            user.IdUsuario,
            user.Email,
            user.Role?.Name ?? "User"
        );

        return new AuthResponseDto { Token = token };
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
    {
        var user = await _userRepository.GetByEmailAsync(dto.Email);
        if (user == null)
            return null;

        var validPassword = _passwordHashService.VerifyPassword(
            dto.Password,
            user.Contrasena
        );

        if (!validPassword)
            return null;

        var token = _jwtTokenGenerator.GenerateToken(
            user.IdUsuario,
            user.Email,
            user.Role?.Name ?? "User"
        );

        return new AuthResponseDto { Token = token };
    }
}
