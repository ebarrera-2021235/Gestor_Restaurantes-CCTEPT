using System;
using System.ComponentModel.DataAnnotations;

namespace AuthService.Domain.Entities;

public class Role
{
    [Key] //Anotaciones de llave primaria
    [MaxLength(16)] 
    public string Id {get; set;} = string.Empty;

    [Required(ErrorMessage = "El nombre del rol es incorrecto.")] //Anotacion sobre correcion de error.
    [MaxLength(35, ErrorMessage = "El nombre del rol no puede exceder los 35 caracteres.")]
    public string Name { get; set; } = string.Empty;

    public DateTime CreatedAt {get; set;} = DateTime.UtcNow;

    public DateTime UpdatedAt {get; set;} = DateTime.UtcNow;

    public ICollection<UserRole> UserRoles {get; set;} = [];    
 }

 

