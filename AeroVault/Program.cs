using Microsoft.EntityFrameworkCore;
using AeroVault.Models;
using Microsoft.Extensions.FileProviders;
using AeroVault.Data;
using AeroVault.Business;
using AeroVault.Repositories; 
using AeroVault.Services;  

namespace AeroVault
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Configure the DbContext with Oracle connection
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseOracle(builder.Configuration.GetConnectionString("DefaultConnection")));

            builder.Services.AddControllersWithViews();

            builder.Services.AddScoped<DivisionRepository>();
            builder.Services.AddScoped<DivisionService>();

            builder.Services.AddScoped<DepartmentRepository>();
            builder.Services.AddScoped<DepartmentService>();

            builder.Services.AddScoped<SystemRepository>();
            builder.Services.AddScoped<SystemService>();

            builder.Services.AddScoped<UploadDl>();
            builder.Services.AddScoped<UploadBl>();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage(); // Show detailed error pages in development
            }
            else
            {
                app.UseExceptionHandler("/Home/Error"); // Handle errors in production
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(
                    Path.Combine(Directory.GetCurrentDirectory(), "Content")),
                RequestPath = "/Content"
            });

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(
                    Path.Combine(Directory.GetCurrentDirectory(), "Scripts")),
                RequestPath = "/Scripts"
            });

            app.UseRouting();

            app.UseAuthorization();

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Admin}/{action=Index}/{id?}");
            app.Run();
        }
    }
}