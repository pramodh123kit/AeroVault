using AeroVault.Models;
using Microsoft.EntityFrameworkCore;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AeroVault.Repositories
{
    public class DepartmentRepository
    {
        private readonly string _connectionString;
        private readonly ApplicationDbContext _context;

        public DepartmentRepository(ApplicationDbContext context)
        {
            _context = context;
            _connectionString = "User Id=c##aerovault;Password=123;Data Source=localhost:1521/xe;";
        }

        public async Task<List<DepartmentModel>> GetAllDepartmentsAsync()
        {
            return await _context.Set<DepartmentModel>()
                .FromSqlRaw("SELECT * FROM C##AEROVAULT.DEPARTMENTS WHERE is_deleted = 0")
                .ToListAsync();
        }

        public async Task<List<DivisionModel>> GetAllDivisionsAsync()
        {
            return await _context.Set<DivisionModel>()
                .FromSqlRaw("SELECT * FROM C##AEROVAULT.DIVISIONS")
                .ToListAsync();
        }

        public async Task<bool> DepartmentExistsAsync(string departmentName, int divisionId)
        {
            using (var connection = new OracleConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new OracleCommand(
                    "SELECT COUNT(*) FROM C##AEROVAULT.Departments WHERE LOWER(DepartmentName) = LOWER(:DepartmentName) AND DivisionID = :DivisionID",
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

                // Insert Department
                string insertSql = @"
                INSERT INTO C##AEROVAULT.Departments (DepartmentName, DivisionID) 
                VALUES (:DepartmentName, :DivisionID)
                RETURNING DepartmentID INTO :NewDepartmentID";

                using (var insertCommand = new OracleCommand(insertSql, connection))
                {
                    insertCommand.Parameters.Add(new OracleParameter(":DepartmentName", departmentName));
                    insertCommand.Parameters.Add(new OracleParameter(":DivisionID", divisionId));

                    var newDepartmentIdParam = new OracleParameter(":NewDepartmentID", OracleDbType.Int32)
                    {
                        Direction = System.Data.ParameterDirection.Output
                    };
                    insertCommand.Parameters.Add(newDepartmentIdParam);

                    await insertCommand.ExecuteNonQueryAsync();

                    // Get new department ID
                    newDepartmentId = newDepartmentIdParam.Value switch
                    {
                        Oracle.ManagedDataAccess.Types.OracleDecimal oracleDecimal => oracleDecimal.ToInt32(),
                        int intValue => intValue,
                        _ => Convert.ToInt32(newDepartmentIdParam.Value)
                    };
                }

                // Fetch Division Name
                string divisionNameSql = "SELECT DivisionName FROM C##AEROVAULT.Divisions WHERE DivisionID = :DivisionID";
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
                string updateSql = "UPDATE C##AEROVAULT.Departments SET DepartmentName = :DepartmentName, DivisionID = :DivisionID WHERE DepartmentID = :DepartmentID";

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
                string updateSql = "UPDATE C##AEROVAULT.DEPARTMENTS SET is_deleted = 1 WHERE DepartmentID = :DepartmentId";

                using (var command = new OracleCommand(updateSql, connection))
                {
                    command.Parameters.Add(new OracleParameter(":DepartmentId", departmentId));

                    int rowsAffected = await command.ExecuteNonQueryAsync();
                    return rowsAffected > 0;
                }
            }
        }
    }
}