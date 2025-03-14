using AeroVault.Models;
using Oracle.ManagedDataAccess.Client;
using System.Threading.Tasks; // For async methods

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

        public async Task<List<FileModel>> GetFilesBySystemAsync(int systemId)
        {
            using (var connection = new OracleConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new OracleCommand(
                    "SELECT FileID, SystemID, FileName, FileType, FileCategory, Added_Date, UniqueFileIdentifier FROM Files WHERE SystemID = :systemId AND IS_DELETED = 0", connection))
                {
                    command.Parameters.Add(new OracleParameter("systemId", systemId));
                    var files = new List<FileModel>();
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            files.Add(new FileModel
                            {
                                FileID = Convert.ToInt32(reader["FileID"]),
                                SystemID = Convert.ToInt32(reader["SystemID"]),
                                FileName = reader["FileName"].ToString(),
                                FileType = reader["FileType"].ToString(),
                                FileCategory = reader["FileCategory"].ToString(),
                                AddedDate = reader["Added_Date"] != DBNull.Value ? Convert.ToDateTime(reader["Added_Date"]) : (DateTime?)null,
                                UniqueFileIdentifier = reader["UniqueFileIdentifier"] != DBNull.Value ? reader["UniqueFileIdentifier"].ToString() : null, // Ensure this is included
                            });
                        }
                    }
                    return files;
                }
            }
        }
        public async Task<bool> CheckStaffNoExistsAsync(string staffNo)
        {
            using (var connection = new OracleConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new OracleCommand(
                    "SELECT COUNT(*) FROM VIEWEDFILES WHERE STAFFNO = :staffNo", connection))
                {
                    command.Parameters.Add(new OracleParameter("staffNo", staffNo));
                    var count = Convert.ToInt32(await command.ExecuteScalarAsync());
                    return count > 0; // Returns true if count is greater than 0
                }
            }
        }

        public async Task<StaffModel> GetStaffDetailsAsync(string staffNo)
        {
            using (var connection = new OracleConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new OracleCommand(
                    "SELECT STAFFNAME, EMAIL, JOBTITLE, DEPARTMENT FROM STAFF WHERE STAFFNO = :staffNo", connection))
                {
                    command.Parameters.Add(new OracleParameter("staffNo", staffNo));
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return new StaffModel
                            {
                                StaffNo = staffNo,
                                StaffName = reader["STAFFNAME"].ToString(),
                                Email = reader["EMAIL"].ToString(),
                                JobTitle = reader["JOBTITLE"].ToString(),
                                Department = reader["DEPARTMENT"].ToString()
                            };
                        }
                    }
                }
            }
            return null;
        }

        public async Task<DepartmentModel> GetDepartmentByNameAsync(string departmentName)
        {
            using (var connection = new OracleConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new OracleCommand(
                    "SELECT DepartmentID, DepartmentName FROM DEPARTMENTS WHERE DepartmentName = :departmentName AND IS_DELETED = 0", connection))
                {
                    command.Parameters.Add(new OracleParameter("departmentName", departmentName));
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return new DepartmentModel
                            {
                                DepartmentID = Convert.ToInt32(reader["DepartmentID"]),
                                DepartmentName = reader["DepartmentName"].ToString()
                            };
                        }
                    }
                }
            }
            return null;
        }
        public async Task<SystemModel> GetSystemByIdAsync(int systemId)
        {
            using (var connection = new OracleConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new OracleCommand(
                    "SELECT SystemID, SystemName, Description FROM SYSTEMS WHERE SystemID = :systemId AND IS_DELETED = 0", connection))
                {
                    command.Parameters.Add(new OracleParameter("systemId", systemId));
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return new SystemModel
                            {
                                SystemID = Convert.ToInt32(reader["SystemID"]),
                                SystemName = reader["SystemName"].ToString(),
                                Description = reader["Description"].ToString()
                            };
                        }
                    }
                }
            }
            return null; // Return null if not found
        }
        public async Task<ViewedFileModel> CheckFileViewedAsync(string staffNo, string uniqueFileIdentifier)
        {
            using (var connection = new OracleConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new OracleCommand(
                    "SELECT VIEWEDDATE FROM VIEWEDFILES WHERE STAFFNO = :staffNo AND UNIQUEFILEIDENTIFIER = :uniqueFileIdentifier", connection))
                {
                    command.Parameters.Add(new OracleParameter("staffNo", staffNo));
                    command.Parameters.Add(new OracleParameter("uniqueFileIdentifier", uniqueFileIdentifier));

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return new ViewedFileModel
                            {
                                ViewedDate = reader["VIEWEDDATE"] != DBNull.Value ? Convert.ToDateTime(reader["VIEWEDDATE"]) : (DateTime?)null,
                                Status = "Read"
                            };
                        }
                    }
                }
            }
            return new ViewedFileModel { ViewedDate = null, Status = "Pending" }; // Not viewed
        }

        public async Task<List<string>> GetUniqueFileIdentifiersByStaffNoAsync(string staffNo)
        {
            var uniqueFileIdentifiers = new List<string>();

            using (var connection = new OracleConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new OracleCommand(
                    "SELECT UNIQUEFILEIDENTIFIER FROM VIEWEDFILES WHERE STAFFNO = :staffNo", connection))
                {
                    command.Parameters.Add(new OracleParameter("staffNo", staffNo));
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            uniqueFileIdentifiers.Add(reader["UNIQUEFILEIDENTIFIER"].ToString());
                        }
                    }
                }
            }

            return uniqueFileIdentifiers;
        }

        public async Task<List<ViewedFileModel>> GetViewedFilesByStaffNoAsync(string staffNo)
        {
            var viewedFiles = new List<ViewedFileModel>();

            using (var connection = new OracleConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new OracleCommand(
                    "SELECT UNIQUEFILEIDENTIFIER, VIEWEDDATE FROM VIEWEDFILES WHERE STAFFNO = :staffNo", connection))
                {
                    command.Parameters.Add(new OracleParameter("staffNo", staffNo));
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            viewedFiles.Add(new ViewedFileModel
                            {
                                UniqueFileIdentifier = reader["UNIQUEFILEIDENTIFIER"].ToString(),
                                ViewedDate = reader["VIEWEDDATE"] != DBNull.Value ? Convert.ToDateTime(reader["VIEWEDDATE"]) : (DateTime?)null
                            });
                        }
                    }
                }
            }

            return viewedFiles;
        }
    }
}