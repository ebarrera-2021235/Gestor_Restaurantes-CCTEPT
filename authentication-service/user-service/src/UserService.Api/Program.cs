using Microsoft.EntityFrameworkCore;
using UserService.Persistence.Data;
using UserService.Application.Interfaces;
using UserService.Application.Services;
using UserService.Domain.Interfaces;
using UserService.Persistence.Repositories;

var builder = WebApplication.CreateBuilder(args);

/// -------------------- SERVICES --------------------

builder.Services.AddControllers()
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.PropertyNamingPolicy =
            System.Text.Json.JsonNamingPolicy.CamelCase;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

/// -------------------- DATABASE --------------------

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection"))
);

/// -------------------- REPOSITORIES --------------------

builder.Services.AddScoped<IUserRepository, UserRepository>();

/// -------------------- APPLICATION SERVICES --------------------

// User Service
builder.Services.AddScoped<IUserService, UserService.Application.Services.UserService>();

// 🔐 Password Hash Service (NUEVO)
builder.Services.AddScoped<IPasswordHashService, PasswordHashService>();

// 🔐 Auth Service (NUEVO)
builder.Services.AddScoped<IAuthService, AuthService>();

var app = builder.Build();

/// -------------------- MIDDLEWARE --------------------

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

/// -------------------- MIGRATIONS --------------------

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.Migrate();
}

app.Run();
