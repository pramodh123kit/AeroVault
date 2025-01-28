using AeroVault.Models;
using Oracle.ManagedDataAccess.Client;

namespace AeroVault.Data
{
    public class ReviewDl
    {
        private readonly string _connectionString;

        public ReviewDl(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
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

        public async Task<List<SystemModel>> GetSystemsByDepartmentAsync(int departmentId)
        {
            using (var connection = new OracleConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new OracleCommand(
                    "SELECT s.SystemID, s.SystemName, s.Description " +
                    "FROM SYSTEMS s " +
                    "JOIN SYSTEM_DEPARTMENTS sd ON s.SystemID = sd.SystemID " +
                    "WHERE sd.DepartmentID = :departmentId AND s.IS_DELETED = 0", connection))
                {
                    command.Parameters.Add(new OracleParameter("departmentId", departmentId));
                    var systems = new List<SystemModel>();
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            systems.Add(new SystemModel
                            {
                                SystemID = Convert.ToInt32(reader["SystemID"]),
                                SystemName = reader["SystemName"].ToString(),
                                Description = reader["Description"].ToString()
                            });
                        }
                    }
                    return systems;
                }
            }
        }
    }
}