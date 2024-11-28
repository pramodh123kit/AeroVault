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

        // Method to test the database connection
        public async Task<bool> TestConnectionAsync()
        {
            try
            {
                // Attempt to connect to the database
                return await this.Database.CanConnectAsync();
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Connection failed: {ex.Message}");

                // Optionally, log the stack trace

                Console.WriteLine(ex.StackTrace);

                return false; // Connection failed
            }
        }
    }
}