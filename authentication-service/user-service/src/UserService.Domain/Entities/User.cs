using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UserService.Domain.Entities
{
    public class User
    {
        [Key]
        [MaxLength(16)]
        [Column("id_usuario")]
        public string IdUsuario { get; set; } = Guid.NewGuid().ToString("N").Substring(0, 16);

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
        [Column("contrasena")]
        public string Contrasena { get; set; } = string.Empty;

        [Column("fecha_creacion")]
        public DateTime FechaCreacion { get; set; } = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Utc);

        public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
        public virtual ICollection<Rating> Ratings { get; set; } = new List<Rating>();
    }
}