using AeroVault.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Oracle.ManagedDataAccess.Client;

namespace AeroVault.Data
{
    public class DivisionRepository
    {
        private readonly string _connectionString;
        private readonly ApplicationDbContext _context;

        public DivisionRepository(ApplicationDbContext context)
        {
            _context = context;
            _connectionString = "User Id=c##aerovault;Password=123;Data Source=localhost:1521/xe;";
        }


        public async Task<List<DivisionModel>> GetAllDivisionsAsync()
        {
            var divisions = await _context.Set<DivisionModel>()
                .FromSqlRaw("SELECT * FROM C##AEROVAULT.DIVISIONS WHERE IsDeleted = 0")
                .ToListAsync();

            return divisions ?? new List<DivisionModel>(); // Return an empty list if null
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
                Console.WriteLine($"Oracle Error: {ex.Message}");
                Console.WriteLine($"Error Code: {ex.ErrorCode}");
                throw;
            }
            catch (Exception ex)
            {
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

        public async Task<bool> SoftDeleteDivisionAsync(int divisionId)
        {
            using (var connection = new OracleConnection(_connectionString))
            {
                await connection.OpenAsync();
                string updateSql = "UPDATE C##AEROVAULT.DIVISIONS SET IsDeleted = 1 WHERE DivisionID = :DivisionId";

                using (var command = new OracleCommand(updateSql, connection))
                {
                    command.Parameters.Add(new OracleParameter(":DivisionId", divisionId));

                    int rowsAffected = await command.ExecuteNonQueryAsync();
                    return rowsAffected > 0;
                }
            }
        }

        public async Task<List<DepartmentModel>> GetDepartmentsByDivisionAsync(int divisionId)
        {
            using (var connection = new OracleConnection(_connectionString))
            {
                await connection.OpenAsync();
                string sql = "SELECT * FROM C##AEROVAULT.DEPARTMENTS WHERE DivisionID = :DivisionID AND IS_DELETED = 0"; 
                using (var command = new OracleCommand(sql, connection))
                {
                    command.Parameters.Add(new OracleParameter(":DivisionID", divisionId));
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        var departments = new List<DepartmentModel>();
                        while (await reader.ReadAsync())
                        {
                            departments.Add(new DepartmentModel
                            {
                                DepartmentID = reader.GetInt32(0),
                                DepartmentName = reader.GetString(1),
                                DivisionID = reader.GetInt32(2),
                                IsDeleted = reader.GetInt32(3) 
                            });
                        }
                        return departments;
                    }
                }
            }
        }
    }
}