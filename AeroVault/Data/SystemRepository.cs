using Oracle.ManagedDataAccess.Client;
using AeroVault.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using static AeroVault.Controllers.SystemsController;
using System.Xml.Linq;

namespace AeroVault.Data
{
    public class SystemRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly string _connectionString = "User Id=c##aerovault;Password=123;Data Source=localhost:1521/xe;";

        public SystemRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<SystemModel>> GetAllSystemsAsync()
        {
            var systems = new List<SystemModel>();

            using (var connection = new OracleConnection(_connectionString))
            {
                await connection.OpenAsync();

                string sql = @"
    SELECT DISTINCT s.SystemID, s.SystemName, s.Description, s.added_date
    FROM c##aerovault.SYSTEMS s
    JOIN c##aerovault.SYSTEM_DEPARTMENTS sd ON s.SystemID = sd.SystemID
    JOIN c##aerovault.DEPARTMENTS d ON sd.DepartmentID = d.DepartmentID
    WHERE s.IS_DELETED = 0 AND d.IS_DELETED = 0";

                using (var command = new OracleCommand(sql, connection))
                {
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var description = reader.IsDBNull(2) ? string.Empty : reader.GetString(2);
                            var addedDate = reader.IsDBNull(3) ? (DateTime?)null : reader.GetDateTime(3);

                            systems.Add(new SystemModel
                            {
                                SystemID = reader.GetInt32(0),
                                SystemName = reader.GetString(1),
                                Description = description,
                                AddedDate = addedDate
                            });
                        }
                    }
                }
            }
            return systems;
        }

        public async Task<bool> CheckSystemExistsAsyncch
            (string systemName)
        {
            string sql = "SELECT COUNT(*) FROM c##aerovault.SYSTEMS WHERE LOWER(SystemName) = LOWER(:SystemName)";
            using (var connection = new OracleConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new OracleCommand(sql, connection))
                {
                    command.Parameters.Add(new OracleParameter(":SystemName", systemName));
                    int count = Convert.ToInt32(await command.ExecuteScalarAsync());
                    return count > 0;
                }
            }
        }

        public async Task<int> CreateSystemAsync(CreateSystemRequest request)
        {
            OracleConnection connection = null;
            OracleTransaction transaction = null;

            try
            {
                connection = new OracleConnection(_connectionString);
                await connection.OpenAsync();
                transaction = connection.BeginTransaction();

                string checkSql = "SELECT COUNT(*) FROM c##aerovault.SYSTEMS WHERE LOWER(SYSTEMNAME) = LOWER(:SystemName)";
                using (var checkCommand = new OracleCommand(checkSql, connection))
                {
                    checkCommand.Transaction = transaction;
                    checkCommand.Parameters.Add(new OracleParameter(":SystemName", request.SystemName));
                    int count = Convert.ToInt32(await checkCommand.ExecuteScalarAsync());

                    if (count > 0)
                    {
                        throw new InvalidOperationException("A system with this name already exists");
                    }
                }

                int newSystemId;
                string insertSql = @"
                INSERT INTO c##aerovault.SYSTEMS (SYSTEMID, SYSTEMNAME, DESCRIPTION) 
                VALUES (c##aerovault.SYSTEMS_SEQ.NEXTVAL, :SystemName, :Description)
                RETURNING SYSTEMID INTO :NewSystemID";

                using (var insertCommand = new OracleCommand(insertSql, connection))
                {
                    insertCommand.Transaction = transaction;
                    insertCommand.Parameters.Add(new OracleParameter(": SystemName", request.SystemName));
                    insertCommand.Parameters.Add(new OracleParameter(":Description", request.Description));

                    var systemIdParam = new OracleParameter(":NewSystemID", OracleDbType.Int32)
                    {
                        Direction = System.Data.ParameterDirection.Output
                    };
                    insertCommand.Parameters.Add(systemIdParam);

                    await insertCommand.ExecuteNonQueryAsync();
                    newSystemId = ConvertOracleDecimal(systemIdParam.Value);
                }

                string insertAssociationSql = @"
                INSERT INTO c##aerovault.SYSTEM_DEPARTMENTS (SYSTEMID, DEPARTMENTID) 
                VALUES (:SystemID, :DepartmentID)";

                foreach (var departmentId in request.DepartmentIds)
                {
                    using (var associationCommand = new OracleCommand(insertAssociationSql, connection))
                    {
                        associationCommand.Transaction = transaction;
                        associationCommand.Parameters.Add(new OracleParameter(":SystemID", newSystemId));
                        associationCommand.Parameters.Add(new OracleParameter(":DepartmentID", departmentId));

                        await associationCommand.ExecuteNonQueryAsync();
                    }
                }
                transaction.Commit();
                return newSystemId;
            }
            catch
            {
                transaction?.Rollback();
                throw;
            }
            finally
            {
                transaction?.Dispose();
                connection?.Close();
                connection?.Dispose();
            }
        }

        public async Task<bool> DeleteSystemAsync(int systemId)
        {
            var system = await _context.Set<SystemModel>().FirstOrDefaultAsync(s => s.SystemID == systemId);
            if (system == null) return false;

            _context.Set<SystemModel>().Remove(system);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<object>> GetDivisionsForPopupAsync()
        {
            var divisions = new List<object>();

            using (var connection = new OracleConnection(_context.Database.GetConnectionString()))
            {
                await connection.OpenAsync();

                string divisionsSql = "SELECT DivisionID, DivisionName FROM c##aerovault.DIVISIONS WHERE IsDeleted = 0";
                var divisionList = new List<DivisionModel>();
                using (var command = new OracleCommand(divisionsSql, connection))
                {
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            divisionList.Add(new DivisionModel
                            {
                                DivisionID = reader.GetInt32(0),
                                DivisionName = reader.GetString(1)
                            });
                        }
                    }
                }

                string departmentsSql = @"
        SELECT DepartmentID, DepartmentName, DivisionID 
        FROM c##aerovault.DEPARTMENTS 
        WHERE is_deleted = 0";

                var departmentList = new List<DepartmentModel>();
                using (var command = new OracleCommand(departmentsSql, connection))
                {
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            departmentList.Add(new DepartmentModel
                            {
                                DepartmentID = reader.GetInt32(0),
                                DepartmentName = reader.GetString(1),
                                DivisionID = reader.GetInt32(2)
                            });
                        }
                    }
                }

                foreach (var division in divisionList)
                {
                    divisions.Add(new
                    {
                        divisionName = division.DivisionName,
                        departments = departmentList
                            .Where(d => d.DivisionID == division.DivisionID)
                            .Select(d => new
                            {
                                departmentID = d.DepartmentID,
                                departmentName = d.DepartmentName
                            })
                            .ToList()
                    });
                }
            }
            return divisions;
        }

        private int ConvertOracleDecimal(object value)
        {
            return value switch
            {
                Oracle.ManagedDataAccess.Types.OracleDecimal oracleDecimal => oracleDecimal.ToInt32(),
                int intValue => intValue,
                _ => Convert.ToInt32(value)
            };
        }

        public async Task<SystemModel> UpdateSystemAsync(UpdateSystemRequest request)
        {
            // Validate the request object
            if (request == null)
            {
                Console.WriteLine("UpdateSystemAsync: Received null request");
                throw new ArgumentNullException(nameof(request), "System update request cannot be null");
            }

            if (request.SystemID <= 0)
            {
                Console.WriteLine($"Invalid SystemID: {request.SystemID}");
                throw new ArgumentException("Invalid SystemID", nameof(request.SystemID));
            }

            if (string.IsNullOrWhiteSpace(request.SystemName))
            {
                Console.WriteLine("System name is null or empty");
                throw new ArgumentException("System name cannot be empty", nameof(request.SystemName));
            }

            using (var connection = new OracleConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var transaction = connection.BeginTransaction())
                {
                    try
                    {
                        // Log the request for debugging
                        Console.WriteLine($"Attempting to update system with ID: '{request.SystemID}'");

                        // Update system name and description using SystemID
                        string updateSql = @"
                UPDATE c##aerovault.SYSTEMS 
                SET SYSTEMNAME = :SystemName, 
                    DESCRIPTION = :Description 
                WHERE SYSTEMID = :SystemID";

                        using (var updateCommand = new OracleCommand(updateSql, connection))
                        {
                            updateCommand.Transaction = transaction;
                            updateCommand.Parameters.Add(new OracleParameter(":SystemName", request.SystemName.Trim()));
                            updateCommand.Parameters.Add(new OracleParameter(":Description", request.Description));
                            updateCommand.Parameters.Add(new OracleParameter(":SystemID", request.SystemID)); // Use SystemID for the update

                            Console.WriteLine($"Executing update with System Name: '{request.SystemName}', Description: '{request.Description}', SystemID: {request.SystemID}"); // Log the update parameters

                            int rowsAffected = await updateCommand.ExecuteNonQueryAsync();
                            if (rowsAffected == 0)
                            {
                                Console.WriteLine($"No rows updated for SystemID: {request.SystemID}. It may not exist.");
                                throw new InvalidOperationException("System not found.");
                            }
                        }

                        // Continue with deleting and inserting department associations...
                        string deleteSql = @"
                DELETE FROM c##aerovault.SYSTEM_DEPARTMENTS 
                WHERE SYSTEMID = :SystemID";

                        using (var deleteCommand = new OracleCommand(deleteSql, connection))
                        {
                            deleteCommand.Transaction = transaction;
                            deleteCommand.Parameters.Add(new OracleParameter(":SystemID", request.SystemID));
                            await deleteCommand.ExecuteNonQueryAsync();
                        }

                        string insertAssociationSql = @"
                INSERT INTO c##aerovault.SYSTEM_DEPARTMENTS (SYSTEMID, DEPARTMENTID) 
                VALUES (:SystemID, :DepartmentID)";

                        foreach (var departmentId in request.DepartmentIds)
                        {
                            using (var associationCommand = new OracleCommand(insertAssociationSql, connection))
                            {
                                associationCommand.Transaction = transaction;
                                associationCommand.Parameters.Add(new OracleParameter(":SystemID", request.SystemID));
                                associationCommand.Parameters.Add(new OracleParameter(":DepartmentID", departmentId));

                                await associationCommand.ExecuteNonQueryAsync();
                            }
                        }

                        transaction.Commit();
                        return await GetSystemByIdAsync(request.SystemID); // Fetch the updated system by ID
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        Console.WriteLine($"Error in UpdateSystemAsync: {ex.Message}"); // Log the error
                        throw; // Rethrow the exception to be handled by the controller
                    }
                }
            }
        }

        private async Task<SystemModel> GetSystemByIdAsync(int systemId)
        {
            return await _context.Set<SystemModel>().FirstOrDefaultAsync(s => s.SystemID == systemId);
        }

        private async Task<SystemModel> GetSystemByNameAsync(string systemName)
        {
            return await _context.Set<SystemModel>().FirstOrDefaultAsync(s => s.SystemName == systemName);
        }

        public async Task<string> GetSystemDescriptionAsync(string systemName)
        {
            string sql = "SELECT Description FROM c##aerovault.SYSTEMS WHERE SystemName = :SystemName";
            using (var connection = new OracleConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new OracleCommand(sql, connection))
                {
                    command.Parameters.Add(new OracleParameter(":SystemName", systemName));
                    var result = await command.ExecuteScalarAsync();
                    return result?.ToString() ?? string.Empty;
                }
            }
        }

        public async Task<List<int>> GetSystemDepartmentIdsAsync(string systemName)
        {
            var departmentIds = new List<int>();

            string sql = @"
        SELECT d.DepartmentID 
        FROM c##aerovault.SYSTEMS s
        JOIN c##aerovault.SYSTEM_DEPARTMENTS sd ON s.SYSTEMID = sd.SYSTEMID
        JOIN c##aerovault.DEPARTMENTS d ON sd.DEPARTMENTID = d.DEPARTMENTID
        WHERE LOWER(s.SYSTEMNAME) = LOWER(:SystemName)";

            using (var connection = new OracleConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new OracleCommand(sql, connection))
                {
                    command.Parameters.Add(new OracleParameter(":SystemName", systemName));

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            departmentIds.Add(reader.GetInt32(0));
                        }
                    }
                }
            }
            return departmentIds;
        }


        public async Task<bool> SoftDeleteSystemAsync(string systemName)
        {
            using (var connection = new OracleConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var transaction = connection.BeginTransaction())
                {
                    try
                    {
                        string updateSystemSql = @"
                UPDATE c##aerovault.SYSTEMS 
                SET is_deleted = 1 
                WHERE LOWER(SYSTEMNAME) = LOWER(:SystemName)";

                        using (var updateCommand = new OracleCommand(updateSystemSql, connection))
                        {
                            updateCommand.Transaction = transaction;
                            updateCommand.Parameters.Add(new OracleParameter(":SystemName", systemName));

                            int rowsAffected = await updateCommand.ExecuteNonQueryAsync();

                            Console.WriteLine($"Rows affected by soft delete: {rowsAffected}");

                            if (rowsAffected == 0)
                            {
                                transaction.Rollback();
                                return false;
                            }
                        }

                        transaction.Commit();
                        return true;
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        Console.WriteLine($"Error in SoftDeleteSystemAsync: {ex.Message}");
                        throw;
                    }
                }
            }
        }

        public async Task<bool> CheckSystemExistsAsync(string systemName)
        {
            string sql = "SELECT COUNT(*) FROM c##aerovault.SYSTEMS WHERE LOWER(SystemName) = LOWER(:SystemName)";
            using (var connection = new OracleConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new OracleCommand(sql, connection))
                {
                    command.Parameters.Add(new OracleParameter(":SystemName", systemName));
                    int count = Convert.ToInt32(await command.ExecuteScalarAsync());
                    return count > 0;
                }
            }
        }

        public async Task<SystemModel> GetSystemDetailsAsync(string systemName)
        {
            string sql = "SELECT SystemID, SystemName, Description FROM c##aerovault.SYSTEMS WHERE LOWER(SystemName) = LOWER(:SystemName)";
            using (var connection = new OracleConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new OracleCommand(sql, connection))
                {
                    command.Parameters.Add(new OracleParameter(":SystemName", systemName));
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return new SystemModel
                            {
                                SystemID = reader.GetInt32(0),
                                SystemName = reader.GetString(1),
                                Description = reader.IsDBNull(2) ? string.Empty : reader.GetString(2)
                            };
                        }
                    }
                }
            }
            return null; // Return null if not found
        }
    }
}