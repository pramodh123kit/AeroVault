using AeroVault.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Oracle.ManagedDataAccess.Client;

namespace AeroVault.Data
{
    public class DivisionRepository
    {
        private readonly ApplicationDbContext _context;

        public DivisionRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<DivisionModel>> GetAllDivisionsAsync()
        {
            return await _context.Set<DivisionModel>()
                .FromSqlRaw("SELECT * FROM C##AEROVAULT.DIVISIONS") // Ensure the schema is correct
                .ToListAsync();
        }

        public async Task AddDivisionAsync(string divisionName)
        {
            if (string.IsNullOrEmpty(divisionName))
            {
                throw new ArgumentException("Division name cannot be empty.");
            }

            try
            {
                string sql = "INSERT INTO C##AEROVAULT.DIVISIONS (DivisionName) VALUES (:DivisionName)";
                var parameter = new OracleParameter(":DivisionName", divisionName);

                int rowsAffected = await _context.Database.ExecuteSqlRawAsync(sql, parameter);

                if (rowsAffected == 0)
                {
                    throw new Exception("No rows were inserted.");
                }
            }
            catch (OracleException ex)
            {
                // Log the specific Oracle exception
                Console.WriteLine($"Oracle Error: {ex.Message}");
                Console.WriteLine($"Error Code: {ex.ErrorCode}");
                throw;
            }
            catch (Exception ex)
            {
                // Log any other exceptions
                Console.WriteLine($"Unexpected error: {ex.Message}");
                throw;
            }
        }

        public async Task UpdateDivisionNameAsync(string originalName, string newDivisionName)
        {
            string sql = @"
        UPDATE C##AEROVAULT.DIVISIONS 
        SET DivisionName = :NewDivisionName 
        WHERE DivisionName = :OriginalName";

            var parameters = new[]
            {
        new OracleParameter(":NewDivisionName", newDivisionName),
        new OracleParameter(":OriginalName", originalName)
    };

            int rowsAffected = await _context.Database.ExecuteSqlRawAsync(sql, parameters);

            if (rowsAffected == 0)
            {
                throw new Exception("No rows were updated. Division may not exist.");
            }
        }
    }
}