using UserService.Application.DTOs;
using UserService.Application.Interfaces;
using UserService.Domain.Interfaces;
using UserService.Domain.Entities;

namespace UserService.Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _repository;

    public UserService(IUserRepository repository)
    {
        _repository = repository;
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
        var user = new User
        {
            IdUsuario = Guid.NewGuid().ToString("N").Substring(0,16),
            Nombre = dto.Nombre,
            Email = dto.Email,
            Contrasena = dto.Contrasena,
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

        user.Nombre = dto.Nombre;
        user.Email = dto.Email;
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