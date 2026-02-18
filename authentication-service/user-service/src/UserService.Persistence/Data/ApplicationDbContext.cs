    using Microsoft.EntityFrameworkCore;
    using UserService.Domain.Entities;

    namespace UserService.Persistence.Data;

    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : DbContext(options)
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<Rating> Ratings { get; set; }

        // snake_case global
        public static string ToSnakeCase(string input)
        {
            if (string.IsNullOrEmpty(input))
                return input;

            return string.Concat(
                input.Select((c, i) => i > 0 && char.IsUpper(c) ? "_" + c : c.ToString())
            ).ToLower();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // tablas y columnas snake_case automático
            foreach (var entity in modelBuilder.Model.GetEntityTypes())
            {
                var tableName = entity.GetTableName();
                if (!string.IsNullOrEmpty(tableName))
                    entity.SetTableName(ToSnakeCase(tableName));

                foreach (var property in entity.GetProperties())
                {
                    var columnName = property.GetColumnName();
                    if (!string.IsNullOrEmpty(columnName))
                        property.SetColumnName(ToSnakeCase(columnName));
                }
            }

            // ================= RATING =================
            modelBuilder.Entity<Rating>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.UserId)
                    .HasMaxLength(16)
                    .IsRequired();

                entity.Property(e => e.Score)
                    .IsRequired();

                entity.Property(e => e.Comment)
                    .HasMaxLength(500);

                entity.HasOne(r => r.User)
                    .WithMany(u => u.Ratings)
                    .HasForeignKey(r => r.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
