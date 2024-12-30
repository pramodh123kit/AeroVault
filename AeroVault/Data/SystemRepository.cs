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
            SELECT DISTINCT s.SystemID, s.SystemName, s.Description 
            FROM C##AEROVAULT.SYSTEMS s
            JOIN C##AEROVAULT.SYSTEM_DEPARTMENTS sd ON s.SystemID = sd.SystemID
            JOIN C##AEROVAULT.DEPARTMENTS d ON sd.DepartmentID = d.DepartmentID
            WHERE s.IS_DELETED = 0 AND d.IS_DELETED = 0"; 

                using (var command = new OracleCommand(sql, connection))
                {
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var description = reader.IsDBNull(2) ? string.Empty : reader.GetString(2);

                            systems.Add(new SystemModel
                            {
                                SystemID = reader.GetInt32(0),
                                SystemName = reader.GetString(1),
                                Description = description
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
            string sql = "SELECT COUNT(*) FROM C##AEROVAULT.SYSTEMS WHERE LOWER(SystemName) = LOWER(:SystemName)";
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

                string checkSql = "SELECT COUNT(*) FROM C##AEROVAULT.SYSTEMS WHERE LOWER(SYSTEMNAME) = LOWER(:SystemName)";
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
                INSERT INTO C##AEROVAULT.SYSTEMS (SYSTEMID, SYSTEMNAME, DESCRIPTION) 
                VALUES (C##AEROVAULT.SYSTEMS_SEQ.NEXTVAL, :SystemName, :Description)
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
                INSERT INTO C##AEROVAULT.SYSTEM_DEPARTMENTS (SYSTEMID, DEPARTMENTID) 
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

                string divisionsSql = "SELECT DivisionID, DivisionName FROM C##AEROVAULT.DIVISIONS WHERE IsDeleted = 0";
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
        FROM C##AEROVAULT.DEPARTMENTS 
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
            using (var connection = new OracleConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var transaction = connection.BeginTransaction())
                {
                    try
                    {
                        string updateSql = @"
                    UPDATE C##AEROVAULT.SYSTEMS 
                    SET SYSTEMNAME = :SystemName, 
                        DESCRIPTION = :Description 
                    WHERE SYSTEMNAME = :OldSystemName";

                        using (var updateCommand = new OracleCommand(updateSql, connection))
                        {
                            updateCommand.Transaction = transaction;
                            updateCommand.Parameters.Add(new OracleParameter(":SystemName", request.SystemName));
                            updateCommand.Parameters.Add(new OracleParameter(":Description", request.Description));
                            updateCommand.Parameters.Add(new OracleParameter(":OldSystemName", request.SystemName));

                            await updateCommand.ExecuteNonQueryAsync();
                        }

                        string deleteSql = @"
                    DELETE FROM C##AEROVAULT.SYSTEM_DEPARTMENTS 
                    WHERE SYSTEMID = (SELECT SYSTEMID FROM C##AEROVAULT.SYSTEMS WHERE SYSTEMNAME = :SystemName)";

                        using (var deleteCommand = new OracleCommand(deleteSql, connection))
                        {
                            deleteCommand.Transaction = transaction;
                            deleteCommand.Parameters.Add(new OracleParameter(":SystemName", request.SystemName));
                            await deleteCommand.ExecuteNonQueryAsync();
                        }

                        string insertAssociationSql = @"
                    INSERT INTO C##AEROVAULT.SYSTEM_DEPARTMENTS (SYSTEMID, DEPARTMENTID) 
                    VALUES ((SELECT SYSTEMID FROM C##AEROVAULT.SYSTEMS WHERE SYSTEMNAME = :SystemName), :DepartmentID)";

                        foreach (var departmentId in request.DepartmentIds)
                        {
                            using (var associationCommand = new OracleCommand(insertAssociationSql, connection))
                            {
                                associationCommand.Transaction = transaction;
                                associationCommand.Parameters.Add(new OracleParameter(":SystemName", request.SystemName));
                                associationCommand.Parameters.Add(new OracleParameter(":DepartmentID", departmentId));

                                await associationCommand.ExecuteNonQueryAsync();
                            }
                        }
                        transaction.Commit();
                        return await GetSystemByNameAsync(request.SystemName); 
                    }
                    catch
                    {
                        transaction.Rollback();
                        throw;
                    }
                }
            }
        }

        private async Task<SystemModel> GetSystemByNameAsync(string systemName)
        {
            return await _context.Set<SystemModel>().FirstOrDefaultAsync(s => s.SystemName == systemName);
        }

        public async Task<string> GetSystemDescriptionAsync(string systemName)
        {
            string sql = "SELECT Description FROM C##AEROVAULT.SYSTEMS WHERE SystemName = :SystemName";
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
        FROM C##AEROVAULT.SYSTEMS s
        JOIN C##AEROVAULT.SYSTEM_DEPARTMENTS sd ON s.SYSTEMID = sd.SYSTEMID
        JOIN C##AEROVAULT.DEPARTMENTS d ON sd.DEPARTMENTID = d.DEPARTMENTID
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
                UPDATE C##AEROVAULT.SYSTEMS 
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
            string sql = "SELECT COUNT(*) FROM C##AEROVAULT.SYSTEMS WHERE LOWER(SystemName) = LOWER(:SystemName)";
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
            string sql = "SELECT SystemID, SystemName, Description FROM C##AEROVAULT.SYSTEMS WHERE LOWER(SystemName) = LOWER(:SystemName)";
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