using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UserService.Domain.Entities;

public class UserRole
{
    [Key]
    [MaxLength(16)]
    [Column("id_user_role")]
    public string Id { get; set; } = string.Empty;

    [Required]
    [MaxLength(16)]
    [Column("id_usuario")]
    public string UserId { get; set; } = string.Empty;

    [Required]
    [Column("id_rol")]
    public int RoleId { get; set; }

    // Auditoría (Buena práctica mencionada en tu ejemplo)
    [Column("fecha_creacion")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    [Column("fecha_actualizacion")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // --- Propiedades de Navegación ---

    [ForeignKey("UserId")]
    public virtual User User { get; set; } = null!;

    [ForeignKey("RoleId")]
    public virtual Role Role { get; set; } = null!;
}