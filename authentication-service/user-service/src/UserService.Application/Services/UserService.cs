using UserService.Application.DTOs;
using UserService.Application.Interfaces;
using UserService.Domain.Interfaces;
using UserService.Domain.Entities;

namespace UserService.Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _repository;
    private readonly IPasswordHashService _passwordHashService;

    public UserService(
        IUserRepository repository,
        IPasswordHashService passwordHashService)
    {
        _repository = repository;
        _passwordHashService = passwordHashService;
    }

    public async Task<IEnumerable<UserResponseDto>> GetAllAsync()
    {
        var users = await _repository.GetAllAsync();

        return users.Select(u => new UserResponseDto
        {
            IdUsuario = u.IdUsuario,
            Nombre = u.Nombre,
            Email = u.Email,
            FechaCreacion = u.FechaCreacion,
            IdRol = u.IdRol
        });
    }

    public async Task<UserResponseDto?> GetByIdAsync(string id)
    {
        var user = await _repository.GetByIdAsync(id);
        if (user == null) return null;

        return new UserResponseDto
        {
            IdUsuario = user.IdUsuario,
            Nombre = user.Nombre,
            Email = user.Email,
            FechaCreacion = user.FechaCreacion,
            IdRol = user.IdRol
        };
    }

    public async Task<UserResponseDto> CreateAsync(CreateUserDto dto)
    {
        // 🔐 Validar email duplicado
        if (await _repository.ExistsByEmailAsync(dto.Email.ToLower()))
            throw new Exception("El email ya está registrado.");

        // 🔐 Validar contraseña mínima
        if (string.IsNullOrWhiteSpace(dto.Contrasena) || dto.Contrasena.Length < 8)
            throw new Exception("La contraseña debe tener al menos 8 caracteres.");

        // 🔐 Hashear contraseña
        var hashedPassword = _passwordHashService.HashPassword(dto.Contrasena);

        var user = new User
        {
            IdUsuario = Guid.NewGuid().ToString("N").Substring(0, 16),
            Nombre = dto.Nombre,
            Email = dto.Email.ToLower(),
            Contrasena = hashedPassword,
            IdRol = dto.IdRol
        };

        await _repository.AddAsync(user);

        return new UserResponseDto
        {
            IdUsuario = user.IdUsuario,
            Nombre = user.Nombre,
            Email = user.Email,
            FechaCreacion = user.FechaCreacion,
            IdRol = user.IdRol
        };
    }

    public async Task<bool> UpdateAsync(string id, UpdateUserDto dto)
    {
        var user = await _repository.GetByIdAsync(id);
        if (user == null) return false;

        // 🔐 Validar email duplicado si cambia
        if (!user.Email.Equals(dto.Email, StringComparison.OrdinalIgnoreCase))
        {
            if (await _repository.ExistsByEmailAsync(dto.Email.ToLower()))
                throw new Exception("El email ya está registrado.");
        }

        user.Nombre = dto.Nombre;
        user.Email = dto.Email.ToLower();
        user.IdRol = dto.IdRol;

        await _repository.UpdateAsync(user);
        return true;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var user = await _repository.GetByIdAsync(id);
        if (user == null) return false;

        await _repository.DeleteAsync(user);
        return true;
    }
}
