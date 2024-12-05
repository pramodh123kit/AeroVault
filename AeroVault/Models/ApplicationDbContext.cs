using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace AeroVault.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<SystemModel> Systems { get; set; }
        public DbSet<DivisionModel> Divisions { get; set; }
        public DbSet<DepartmentModel> Departments { get; set; }

        // Add this new DbSet for the junction table
        public DbSet<SystemDepartmentModel> SystemDepartments { get; set; }

        // Add this method to configure relationships
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure the many-to-many relationship
            modelBuilder.Entity<SystemDepartmentModel>()
                .HasKey(sd => new { sd.SystemID, sd.DepartmentID });

            modelBuilder.Entity<SystemDepartmentModel>()
                .HasOne(sd => sd.System)
                .WithMany(s => s.SystemDepartments)
                .HasForeignKey(sd => sd.SystemID);

            modelBuilder.Entity<SystemDepartmentModel>()
                .HasOne(sd => sd.Department)
                .WithMany(d => d.SystemDepartments)
                .HasForeignKey(sd => sd.DepartmentID);

            base.OnModelCreating(modelBuilder);
        }

        // Existing TestConnectionAsync method...
        public async Task<bool> TestConnectionAsync()
        {
            try
            {
                return await this.Database.CanConnectAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Connection failed: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
                return false;
            }
        }
    }
}