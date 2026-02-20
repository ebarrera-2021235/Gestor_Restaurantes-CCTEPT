using UserService.Application.DTOs;
using UserService.Application.Interfaces;
using UserService.Domain.Entities;
using UserService.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace UserService.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHashService _passwordHashService;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IEmailService _emailService;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        IUserRepository userRepository,
        IPasswordHashService passwordHashService,
        IJwtTokenGenerator jwtTokenGenerator,
        IEmailService emailService,
        ILogger<AuthService> logger)
    {
        _userRepository = userRepository;
        _passwordHashService = passwordHashService;
        _jwtTokenGenerator = jwtTokenGenerator;
        _emailService = emailService;
        _logger = logger;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        var existingUser = await _userRepository.GetByEmailAsync(dto.Email);
        if (existingUser != null)
            throw new Exception("El usuario ya existe con ese correo electrónico.");

        var user = new User
        {
            IdUsuario = Guid.NewGuid().ToString("N").Substring(0, 16),
            Email = dto.Email,
            Nombre = dto.Nombre,
            Contrasena = _passwordHashService.HashPassword(dto.Password),
            FechaCreacion = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Utc),
            UserRoles = new List<UserRole>
            {
                new UserRole 
                { 
                    Id = Guid.NewGuid().ToString("N").Substring(0, 16),
                    RoleId = 2
                }
            }
        };

        await _userRepository.AddAsync(user);

        try 
        {
            await _emailService.SendWelcomeEmailAsync(dto.Email, dto.Nombre);
            _logger.LogInformation("Correo de bienvenida enviado a: {Email}", dto.Email);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al enviar el correo, pero el usuario fue creado.");
        }

        var roleName = "User";
        var token = _jwtTokenGenerator.GenerateToken(user.IdUsuario, user.Email, roleName);

        return new AuthResponseDto { Token = token };
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
    {
        var user = await _userRepository.GetByEmailAsync(dto.Email);
        if (user == null) return null;

        var validPassword = _passwordHashService.VerifyPassword(dto.Password, user.Contrasena);
        if (!validPassword) return null;

        var roleName = user.UserRoles.FirstOrDefault()?.Role?.Name ?? "User";
        var token = _jwtTokenGenerator.GenerateToken(user.IdUsuario, user.Email, roleName);

        return new AuthResponseDto { Token = token };
    }
}