using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UserService.Domain.Entities;

public class User
{
    [Key]
    [MaxLength(16)]
    [Column("id_usuario")]
    public string IdUsuario { get; set; } = string.Empty;

    [Required(ErrorMessage = "El nombre es obligatorio")]
    [MaxLength(100)]
    [Column("nombre")]
    public string Nombre { get; set; } = string.Empty;

    [Required(ErrorMessage = "El email es obligatorio")]
    [EmailAddress]
    [MaxLength(150)]
    [Column("email")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "La contraseña es obligatoria")]
    [MinLength(8)]
    [MaxLength(255)]
    [Column("contraseña")]
    public string Contrasena { get; set; } = string.Empty;

    [Column("fecha_creacion")]
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

    // --- Referencia Directa a Role ---
    
    [Required]
    [Column("id_rol")]
    public int IdRol { get; set; }

    [ForeignKey("IdRol")]
    public virtual Role Role { get; set; } = null!;

    // --- Referencia a UserRoles ---
    
    public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}