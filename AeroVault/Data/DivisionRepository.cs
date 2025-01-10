using AeroVault.Models;
using Microsoft.EntityFrameworkCore;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration; // Make sure to include this namespace

namespace AeroVault.Data
{
    public class DivisionRepository
    {
        private readonly string _connectionString;
        private readonly ApplicationDbContext _context;

        // Update the constructor to accept IConfiguration
        public DivisionRepository(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<List<DivisionModel>> GetAllDivisionsAsync()
        {
            using (var connection = new OracleConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new OracleCommand(
                    "SELECT DivisionID, DivisionName, IsDeleted, ADDED_DATE " +
                    "FROM c##aerovault.DIVISIONS " +
                    "WHERE IsDeleted = 0",
                    connection))
                {
                    var divisions = new List<DivisionModel>();
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            divisions.Add(new DivisionModel
                            {
                                DivisionID = Convert.ToInt32(reader["DivisionID"]),
                                DivisionName = reader["DivisionName"].ToString(),
                                IsDeleted = Convert.ToInt32(reader["IsDeleted"]),
                                AddedDate = reader["ADDED_DATE"] != DBNull.Value
                                    ? Convert.ToDateTime(reader["ADDED_DATE"])
                                    : (DateTime?)null
                            });
                        }
                    }
                    return divisions;
                }
            }
        }

        public async Task AddDivisionAsync(string divisionName)
        {
            if (string.IsNullOrEmpty(divisionName))
            {
                throw new ArgumentException("Division name cannot be empty.");
            }

            try
            {
                string sql = "INSERT INTO c##aerovault.DIVISIONS (DivisionName) VALUES (:DivisionName)";
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
            UPDATE c##aerovault.DIVISIONS 
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
                string updateSql = "UPDATE c##aerovault.DIVISIONS SET IsDeleted = 1 WHERE DivisionID = :DivisionId";

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
                string sql = "SELECT * FROM c##aerovault.DEPARTMENTS WHERE DivisionID = :DivisionID AND IS_DELETED = 0"; 
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