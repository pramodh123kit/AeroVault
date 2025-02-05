using AeroVault.Models;
using Microsoft.EntityFrameworkCore;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration; // Make sure to include this namespace

namespace AeroVault.Repositories
{
    public class DepartmentRepository
    {
        private readonly string _connectionString;
        private readonly ApplicationDbContext _context;

        public DepartmentRepository(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<List<DepartmentModel>> GetDepartmentsAddedAfterAsync(DateTime fromDate)
        {
            var departments = new List<DepartmentModel>();

            using (var connection = new OracleConnection(_connectionString))
            {
                await connection.OpenAsync();
                string sql = @"
            SELECT DepartmentID, DepartmentName, DivisionID, ADDED_DATE
            FROM DEPARTMENTS
            WHERE IS_DELETED = 0 AND ADDED_DATE >= :fromDate";

                using (var command = new OracleCommand(sql, connection))
                {
                    command.Parameters.Add(new OracleParameter(":fromDate", fromDate));

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            departments.Add(new DepartmentModel
                            {
                                DepartmentID = reader.GetInt32(0),
                                DepartmentName = reader.GetString(1),
                                DivisionID = reader.GetInt32(2),
                                AddedDate = reader.GetDateTime(3)
                            });
                        }
                    }
                }
            }
            return departments;
        }

        public async Task<List<DepartmentModel>> GetAllDepartmentsAsync()
        {
            using (var connection = new OracleConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new OracleCommand(
                    "SELECT d.DepartmentID, d.DepartmentName, d.DivisionID, v.DivisionName, d.ADDED_DATE " +
                    "FROM DEPARTMENTS d " +
                    "JOIN DIVISIONS v ON d.DivisionID = v.DivisionID " +
                    "WHERE d.is_deleted = 0 AND v.IsDeleted = 0",
                    connection))
                {
                    var departments = new List<DepartmentModel>();
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            departments.Add(new DepartmentModel
                            {
                                DepartmentID = Convert.ToInt32(reader["DepartmentID"]),
                                DepartmentName = reader["DepartmentName"].ToString(),
                                DivisionID = Convert.ToInt32(reader["DivisionID"]),
                                AddedDate = reader["ADDED_DATE"] != DBNull.Value
                                    ? Convert.ToDateTime(reader["ADDED_DATE"])
                                    : (DateTime?)null,
                                Division = new DivisionModel
                                {
                                    DivisionID = Convert.ToInt32(reader["DivisionID"]),
                                    DivisionName = reader["DivisionName"].ToString()
                                }
                            });
                        }
                    }
                    return departments;
                }
            }
        }

        public async Task<List<DivisionModel>> GetAllDivisionsAsync()
        {
            using (var connection = new OracleConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new OracleCommand(
                    "SELECT DivisionID, DivisionName FROM DIVISIONS WHERE IsDeleted = 0",
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
                                DivisionName = reader["DivisionName"].ToString()
                            });
                        }
                    }
                    return divisions;
                }
            }
        }

        public async Task<bool> DepartmentExistsAsync(string departmentName, int divisionId)
        {
            using (var connection = new OracleConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new OracleCommand(
                    "SELECT COUNT(*) FROM Departments WHERE LOWER(DepartmentName) = LOWER(:DepartmentName) AND DivisionID = :DivisionID",
                    connection))
                {
                    command.Parameters.Add(new OracleParameter(":DepartmentName", departmentName));
                    command.Parameters.Add(new OracleParameter(":DivisionID", divisionId));
                    int count = Convert.ToInt32(await command.ExecuteScalarAsync());
                    return count > 0;
                }
            }
        }

        public async Task<(int DepartmentId, string DivisionName)> AddDepartmentAsync(string departmentName, int divisionId)
        {
            using (var connection = new OracleConnection(_connectionString))
            {
                await connection.OpenAsync();
                int newDepartmentId = 0;
                string divisionName = "";

                // Get the next value from the sequence
                string sequenceSql = "SELECT SEQ_DEPARTMENTID.NEXTVAL FROM dual";
                using (var sequenceCommand = new OracleCommand(sequenceSql, connection))
                {
                    newDepartmentId = Convert.ToInt32(await sequenceCommand.ExecuteScalarAsync());
                }

                // Insert Department using the new DepartmentID
                string insertSql = @"
        INSERT INTO Departments (DepartmentID, DepartmentName, DivisionID) 
        VALUES (:DepartmentID, :DepartmentName, :DivisionID)";

                using (var insertCommand = new OracleCommand(insertSql, connection))
                {
                    insertCommand.Parameters.Add(new OracleParameter(":DepartmentID", newDepartmentId));
                    insertCommand.Parameters.Add(new OracleParameter(":DepartmentName", departmentName));
                    insertCommand.Parameters.Add(new OracleParameter(":DivisionID", divisionId));

                    await insertCommand.ExecuteNonQueryAsync();
                }

                // Fetch Division Name
                string divisionNameSql = "SELECT DivisionName FROM Divisions WHERE DivisionID = :DivisionID";
                using (var divisionCommand = new OracleCommand(divisionNameSql, connection))
                {
                    divisionCommand.Parameters.Add(new OracleParameter(":DivisionID", divisionId));
                    divisionName = (await divisionCommand.ExecuteScalarAsync())?.ToString();
                }

                return (newDepartmentId, divisionName);
            }
        }

        public async Task<bool> UpdateDepartmentAsync(int departmentId, string departmentName, int divisionId)
        {
            using (var connection = new OracleConnection(_connectionString))
            {
                await connection.OpenAsync();
                string updateSql = "UPDATE Departments SET DepartmentName = :DepartmentName, DivisionID = :DivisionID WHERE DepartmentID = :DepartmentID";

                using (var command = new OracleCommand(updateSql, connection))
                {
                    command.Parameters.Add(new OracleParameter(":DepartmentName", departmentName));
                    command.Parameters.Add(new OracleParameter(":DivisionID", divisionId));
                    command.Parameters.Add(new OracleParameter(":DepartmentID", departmentId));

                    int rowsAffected = await command.ExecuteNonQueryAsync();
                    return rowsAffected > 0;
                }
            }
        }

        public async Task<bool> SoftDeleteDepartmentAsync(int departmentId)
        {
            using (var connection = new OracleConnection(_connectionString))
            {
                await connection.OpenAsync();
                string updateSql = "UPDATE DEPARTMENTS SET is_deleted = 1 WHERE DepartmentID = :DepartmentId";

                using (var command = new OracleCommand(updateSql, connection))
                {
                    command.Parameters.Add(new OracleParameter(":DepartmentId", departmentId));

                    int rowsAffected = await command.ExecuteNonQueryAsync();
                    return rowsAffected > 0;
                }
            }
        }

        public async Task<List<SystemModel>> GetSystemsByDepartmentAsync(int departmentId)
        {
            using (var connection = new OracleConnection(_connectionString))
            {
                await connection.OpenAsync();
                string sql = @"
            SELECT s.SystemID, s.SystemName, s.Description 
            FROM SYSTEMS s
            JOIN SYSTEM_DEPARTMENTS sd ON s.SystemID = sd.SystemID
            WHERE sd.DepartmentID = :DepartmentID AND s.is_deleted = 0"; 

                using (var command = new OracleCommand(sql, connection))
                {
                    command.Parameters.Add(new OracleParameter(":DepartmentID", departmentId));
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        var systems = new List<SystemModel>();
                        while (await reader.ReadAsync())
                        {
                            systems.Add(new SystemModel
                            {
                                SystemID = reader.GetInt32(0),
                                SystemName = reader.GetString(1),
                                Description = reader.IsDBNull(2) ? string.Empty : reader.GetString(2)
                            });
                        }
                        return systems;
                    }
                }
            }
        }
    }
}