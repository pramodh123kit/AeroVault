using Microsoft.EntityFrameworkCore;
using AeroVault.Models;
using Microsoft.Extensions.FileProviders;
using AeroVault.Data;
using AeroVault.Business;
using AeroVault.Repositories;
using AeroVault.Services;
using System.DirectoryServices;
using DataLayer;
using SLA_Authentication_DLL; // Add this

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

            // Add APPSEC related services
            builder.Services.AddHttpContextAccessor();
            builder.Services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromMinutes(30);
                options.Cookie.HttpOnly = true;
                options.Cookie.IsEssential = true;
            });

            builder.Services.AddControllersWithViews();

            // Existing repository and service registrations
            builder.Services.AddScoped<DivisionRepository>();
            builder.Services.AddScoped<DivisionService>();

            builder.Services.AddScoped<UserOverviewBl>();
            builder.Services.AddScoped<UserOverviewDl>();

            builder.Services.AddScoped<DepartmentRepository>();
            builder.Services.AddScoped<DepartmentService>();

            builder.Services.AddScoped<SystemRepository>();
            builder.Services.AddScoped<SystemService>();

            builder.Services.AddScoped<FileRepositoryDl>();
            builder.Services.AddScoped<FileRepositoryBl>();

            builder.Services.AddScoped<UploadDl>();
            builder.Services.AddScoped<UploadBl>();

            builder.Services.AddScoped<ReviewDl>();
            builder.Services.AddScoped<ReviewBl>();

            builder.Services.AddScoped<UserOverviewBl>();
            builder.Services.AddScoped<UserOverviewDl>();

            // Add LoginBL as a scoped service
            builder.Services.AddScoped<LoginBL>();
            builder.Services.AddScoped<LoginDL>();

            // Add this to your service configuration
            builder.Services.AddSingleton(sp =>
            {
                var configuration = sp.GetRequiredService<IConfiguration>();
                return new DBManager(
                    Base.SLA_AUTH_ConnectionDataProvider,
                    configuration.GetConnectionString("SLA_AUTH_ConnectionString")
                );
            });

            builder.Logging.ClearProviders();
            builder.Logging.AddConsole();
            builder.Logging.AddDebug();

            builder.Logging.ClearProviders();
            builder.Logging.AddConsole();
            builder.Logging.AddDebug();
            builder.Logging.AddConfiguration(builder.Configuration.GetSection("Logging"));

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

            // Add these lines for session support
            app.UseSession();

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

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Admin}/{action=Index}/{id?}");
            //pattern: "{controller=Admin}/{action=Index}/{id?}");
            //pattern: "{controller=test}/{action=testconnection}/{id?}");
            app.Run();
        }
    }
}