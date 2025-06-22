using Microsoft.EntityFrameworkCore;
using PaymentAPI.Data;

namespace PaymentAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddDbContext<PaymentDbContext>(options => 
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            builder.Services.AddControllers();

            // Add CORS with more permissive settings for development
            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // Just commenting this line out now so I can force 
            // react to use HTTP only to try and solve CORS errors - This is supposed to be commented out during development
            //If this app is deployed however, I need to uncomment it and potentially change the http to https in payment
            // app.UseHttpsRedirection();

            // Enable CORS before authorization
            app.UseCors();

            app.UseAuthorization();
            app.MapControllers();

            app.Run();
        }
    }
}