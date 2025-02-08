using Microsoft.EntityFrameworkCore;
using AeroVault.Models;
using Microsoft.Extensions.FileProviders;
using AeroVault.Data;
using AeroVault.Business;
using AeroVault.Repositories;
using AeroVault.Services;
using System.DirectoryServices;
using DataLayer;
using SLA_Authentication_DLL; 

namespace AeroVault
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.WebHost.ConfigureKestrel(serverOptions =>
            {
                serverOptions.Limits.MaxRequestBodySize = 500 * 1024 * 1024; // 500 MB
            });

            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseOracle(builder.Configuration.GetConnectionString("DefaultConnection")));

            builder.Services.AddHttpContextAccessor();
            builder.Services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromMinutes(30);
                options.Cookie.HttpOnly = true;
                options.Cookie.IsEssential = true;
            });

            builder.Services.AddControllersWithViews();

            // Existing repository and service registrations
            builder.Services.AddScoped<DivisionDl>();
            builder.Services.AddScoped<DivisionBl>();
            builder.Services.AddScoped<UserOverviewBl>();
            builder.Services.AddScoped<UserOverviewDl>();
            builder.Services.AddScoped<DepartmentDl>();
            builder.Services.AddScoped<DepartmentBl>();
            builder.Services.AddScoped<SystemDl>();
            builder.Services.AddScoped<SystemBl>();
            builder.Services.AddScoped<FileRepositoryDl>();
            builder.Services.AddScoped<FileRepositoryBl>();
            builder.Services.AddScoped<UploadDl>();
            builder.Services.AddScoped<UploadBl>();
            builder.Services.AddScoped<ReviewDl>();
            builder.Services.AddScoped<ReviewBl>();
            builder.Services.AddScoped<LoginBl>();
            builder.Services.AddScoped<LoginDl>();

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

            if (app.Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage(); 
            }
            else
            {
                app.UseExceptionHandler("/Home/Error"); 
                app.UseHsts();
            }

            app.UseHttpsRedirection();
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
                //pattern: "{controller=Admin}/{action=Index}/{id?}");
            pattern: "{controller=userfilerepository}/{action=filerepository}/{id?}");
            //pattern: "{controller=login}/{action=index}/{id?}");
            //pattern: "{controller=test}/{action=testconnection}/{id?}");

            app.Run();
        }
    }
}