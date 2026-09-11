
using STBWEBAPI.Repositories.Implementation;
using STBWEBAPI.Repositories.Interface;
using STBWEBAPI.Services.Implementation;
using STBWEBAPI.Services.Interface;
using STBWEBAPI.Data;
using AutoMapper;
using STBWEBAPI.AutoMappers;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddSingleton<ApplicationDbContext>(); // Registers DbContext as a singleton (usually AddDbContext is better)
// AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);
// Repositories
builder.Services.AddScoped<ITaskRepository, TaskRepository>();
// Unit of Work
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
// Services
builder.Services.AddScoped<ITaskService, TaskService>();

// Configure CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder.AllowAnyOrigin()   // Allow requests from any origin
                          .AllowAnyMethod()   // Allow all HTTP methods (GET, POST, etc.)
                          .AllowAnyHeader()); // Allow all headers
});

builder.Services.AddSwaggerGen(); // Adds Swagger generator for API documentation

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger(); // Enable Swagger middleware
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Sprint Task Board for a Remote Team API v1"); // Swagger endpoint
        c.RoutePrefix = string.Empty; // Serve Swagger UI at the root URL
    });
}

app.UseHttpsRedirection(); // Redirects HTTP requests to HTTPS
app.UseAuthorization();    // Enables authorization middleware
app.MapControllers();      // Maps controller routes into the request pipeline
app.UseCors("AllowAll");   // Applies the CORS policy defined above
app.Run();                 // Runs the application and starts listening for requests
