using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UserService.Domain.Entities;

public class Role
{
    [Key]
    [Column("id_rol")]
    public int IdRol { get; set; }

    [Required(ErrorMessage = "El nombre del rol es obligatorio.")]
    [MaxLength(35, ErrorMessage = "El nombre del rol no puede exceder los 35 caracteres.")]
    [Column("nombre_rol")]
    public string Name { get; set; } = string.Empty;

    [MaxLength(255)]
    [Column("permisos")]
    public string? Permisos { get; set; }

    [Column("fecha_creacion")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("fecha_actualizacion")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // --- Relaciones ---
    public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();

}