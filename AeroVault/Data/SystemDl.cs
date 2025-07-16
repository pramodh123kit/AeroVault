﻿using Oracle.ManagedDataAccess.Client;
using AeroVault.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using static AeroVault.Controllers.SystemsController;
using System.Xml.Linq;

namespace AeroVault.Data
{
    public class SystemDl
    {
        private readonly string _connectionString;
        private readonly ApplicationDbContext _context;

        public SystemDl(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<List<SystemModel>> GetSystemsAddedAfterAsync(DateTime fromDate)
        {
            var systems = new List<SystemModel>();

            using (var connection = new OracleConnection(_connectionString))
            {
                await connection.OpenAsync();
                try
                {


                    string sql = @"
            SELECT s.SystemID, s.SystemName, s.Description, s.added_date
            FROM SYSTEMS s
            WHERE s.IS_DELETED = 0 
            AND s.added_date >= :fromDate
            AND EXISTS (
                SELECT 1 
                FROM SYSTEM_DEPARTMENTS sd
                JOIN DEPARTMENTS d ON sd.DepartmentID = d.DepartmentID
                WHERE sd.SystemID = s.SystemID AND d.is_deleted = 0  -- Updated column name
            )";

                    using (var command = new OracleCommand(sql, connection))
                    {
                        command.Parameters.Add(new OracleParameter(":fromDate", fromDate));

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                systems.Add(new SystemModel
                                {
                                    SystemID = Convert.ToInt32(reader["SystemID"]),
                                    SystemName = reader["SystemName"].ToString(),
                                    Description = reader["Description"].ToString(),
                                    AddedDate = Convert.ToDateTime(reader["added_date"]),
                                    
                                });
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"An error occurred: {ex.Message}");


                }
            }
            return systems;
        }

        public async Task<List<SystemModel>> GetAllSystemsAsync()
        {
            var systems = new List<SystemModel>();

            using (var connection = new OracleConnection(_connectionString))
            {
                await connection.OpenAsync();

                try
                {

                    string sql = @"
            SELECT DISTINCT s.SystemID, s.SystemName, s.Description, s.added_date,d.DIVISIONID , s.IS_DELETED
            FROM SYSTEMS s
            JOIN SYSTEM_DEPARTMENTS sd ON s.SystemID = sd.SystemID
            JOIN DEPARTMENTS d ON sd.DepartmentID = d.DepartmentID
            WHERE  d.is_deleted = 0";

                    using (var command = new OracleCommand(sql, connection))
                    {
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {

                                systems.Add(new SystemModel
                                {
                                    SystemID = Convert.ToInt32(reader["SystemID"]),
                                    SystemName = reader["SystemName"].ToString(),
                                    Description = reader["Description"].ToString(),
                                    AddedDate = Convert.ToDateTime(reader["added_date"]),
                                    DivisionID = Convert.ToInt32(reader["DIVISIONID"]),
                                    IsDeleted = Convert.ToInt32(reader["IS_DELETED"]),

                                });
                            
                            }
                        }
                    }

                }
                catch (Exception ex)
                {
                    Console.WriteLine($"An error occurred: {ex.Message}");


                }
            }
                return systems;
            }
        


        public async Task<bool> CheckSystemExistsAsyncch
            (string systemName)
        {
            string sql = "SELECT COUNT(*) FROM SYSTEMS WHERE LOWER(SystemName) = LOWER(:SystemName)";
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

                int newSystemId;
                string sequenceSql = "SELECT SEQ_SYSTEMID.NEXTVAL FROM dual";
                using (var sequenceCommand = new OracleCommand(sequenceSql, connection))
                {
                    newSystemId = Convert.ToInt32(await sequenceCommand.ExecuteScalarAsync());
                }


                string insertSql = @"
        INSERT INTO SYSTEMS (SYSTEMID, SYSTEMNAME, DESCRIPTION) 
        VALUES (:SystemID, :SystemName, :Description)";

                using (var insertCommand = new OracleCommand(insertSql, connection))
                {
                    insertCommand.Transaction = transaction;
                    insertCommand.Parameters.Add(new OracleParameter(":SystemID", newSystemId));
                    insertCommand.Parameters.Add(new OracleParameter(":SystemName", request.SystemName.Trim()));
                    insertCommand.Parameters.Add(new OracleParameter(":Description", request.Description));

                    await insertCommand.ExecuteNonQueryAsync();
                }

                string insertAssociationSql = @"
        INSERT INTO SYSTEM_DEPARTMENTS (SYSTEMID, DEPARTMENTID) 
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
            catch (Exception ex)
            {
                transaction?.Rollback();
                Console.WriteLine($"Error in CreateSystemAsync: {ex.Message}");
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

                string divisionsSql = "SELECT DivisionID, DivisionName FROM DIVISIONS WHERE IsDeleted = 0";  
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
        FROM DEPARTMENTS 
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
                        Console.WriteLine($"Attempting to update system with ID: '{request.SystemID}'");

                        string updateSql = @"
                UPDATE SYSTEMS 
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

                        string deleteSql = @"
                DELETE FROM SYSTEM_DEPARTMENTS 
                WHERE SYSTEMID = :SystemID";

                        using (var deleteCommand = new OracleCommand(deleteSql, connection))
                        {
                            deleteCommand.Transaction = transaction;
                            deleteCommand.Parameters.Add(new OracleParameter(":SystemID", request.SystemID));
                            await deleteCommand.ExecuteNonQueryAsync();
                        }

                        string insertAssociationSql = @"
                INSERT INTO SYSTEM_DEPARTMENTS (SYSTEMID, DEPARTMENTID) 
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
                        return await GetSystemByIdAsync(request.SystemID);
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        throw;
                    }
                }
            }
        }

        //private async Task<SystemModel> GetSystemByIdAsync(int systemId)
        //{
        //    return await _context.Set<SystemModel>().FirstOrDefaultAsync(s => s.SystemID == systemId);
        //}

        private async Task<SystemModel> GetSystemByIdAsync(int systemId)
        {
            using (var connection = new OracleConnection(_connectionString))
            {
                await connection.OpenAsync();

                string sql = @"
            SELECT SYSTEMID, SYSTEMNAME, DESCRIPTION
            FROM SYSTEMS
            WHERE SYSTEMID = :SystemID";

                using (var command = new OracleCommand(sql, connection))
                {
                    command.Parameters.Add(new OracleParameter(":SystemID", systemId));

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return new SystemModel
                            {
                                SystemID = Convert.ToInt32(reader["SYSTEMID"]),
                                SystemName = reader["SYSTEMNAME"].ToString(),
                                Description = reader["DESCRIPTION"].ToString()
                            };
                        }
                    }
                }
            }

            return null;
        }


        private async Task<SystemModel> GetSystemByNameAsync(string systemName)
        {
            return await _context.Set<SystemModel>().FirstOrDefaultAsync(s => s.SystemName == systemName);
        }

        public async Task<string> GetSystemDescriptionAsync(string systemName)
        {
            string sql = "SELECT Description FROM SYSTEMS WHERE SystemName = :SystemName";
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
        FROM SYSTEMS s
        JOIN SYSTEM_DEPARTMENTS sd ON s.SYSTEMID = sd.SYSTEMID
        JOIN DEPARTMENTS d ON sd.DEPARTMENTID = d.DEPARTMENTID
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
                UPDATE SYSTEMS 
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
            string sql = "SELECT COUNT(*) FROM SYSTEMS WHERE LOWER(SystemName) = LOWER(:SystemName)";
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
            string sql = "SELECT SystemID, SystemName, Description FROM SYSTEMS WHERE LOWER(SystemName) = LOWER(:SystemName)";
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
            return null;
        }

        public async Task<List<FileModel>> GetFilesBySystemIdAsync(int systemId)
        {
            var files = new List<FileModel>();

            string sql = @"
        SELECT FileID, FileName, FileType, FileCategory, Added_Date
        FROM FILES 
        WHERE SystemID = :SystemID AND IS_DELETED = 0";

            using (var connection = new OracleConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new OracleCommand(sql, connection))
                {
                    command.Parameters.Add(new OracleParameter(":SystemID", systemId));

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            files.Add(new FileModel
                            {
                                FileID = reader.GetInt32(0),
                                FileName = reader.GetString(1),
                                FileType = reader.IsDBNull(2) ? null : reader.GetString(2),
                                FileCategory = reader.IsDBNull(3) ? null : reader.GetString(3),
                                AddedDate = reader.IsDBNull(4) ? (DateTime?)null : reader.GetDateTime(4)
                            });
                        }
                    }
                }
            }
            return files;
        }
        public async Task<bool> SoftDeleteFileAsync(int fileId)
        {
            using (var connection = new OracleConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var transaction = connection.BeginTransaction())
                {
                    try
                    {
                        string updateFileSql = @"
                            UPDATE FILES 
                            SET IS_DELETED = 1 
                            WHERE FileID = :FileId";

                        using (var updateCommand = new OracleCommand(updateFileSql, connection))
                        {
                            updateCommand.Transaction = transaction;
                            updateCommand.Parameters.Add(new OracleParameter(":FileId", fileId));

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
                        Console.WriteLine($"Error in SoftDeleteFileAsync: {ex.Message}");
                        throw;
                    }
                }
            }
        }


        public async Task<bool> UpdateFileAsync(UpdateFileRequest request)
        {
            using (var connection = new OracleConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var transaction = connection.BeginTransaction())
                {
                    try
                    {
                        string fetchSql = @"
                    SELECT FileName, FileCategory 
                    FROM Files 
                    WHERE FileID = :FileId";

                        string currentFileName = "";
                        string currentFileCategory = "";

                        using (var fetchCommand = new OracleCommand(fetchSql, connection))
                        {
                            fetchCommand.Transaction = transaction;
                            fetchCommand.Parameters.Add(new OracleParameter(":FileId", request.FileId));

                            using (var reader = await fetchCommand.ExecuteReaderAsync())
                            {
                                if (await reader.ReadAsync())
                                {
                                    currentFileName = reader.GetString(0);
                                    currentFileCategory = reader.IsDBNull(1) ? null : reader.GetString(1);
                                }
                                else
                                {
                                    transaction.Rollback();
                                    return false;
                                }
                            }
                        }

                        string updateSql;
                        OracleCommand updateCommand;

                        string fileNameToUpdate = request.FileName ?? currentFileName;
                        string fileCategoryToUpdate = request.FileCategory ?? currentFileCategory;

                        updateSql = @"
                    UPDATE Files 
                    SET FileName = :FileName, 
                        FileCategory = :FileCategory 
                    WHERE FileID = :FileId";

                        updateCommand = new OracleCommand(updateSql, connection);
                        updateCommand.Transaction = transaction;
                        updateCommand.Parameters.Add(new OracleParameter(":FileName", fileNameToUpdate));
                        updateCommand.Parameters.Add(new OracleParameter(":FileCategory", fileCategoryToUpdate));
                        updateCommand.Parameters.Add(new OracleParameter(":FileId", request.FileId));

                        int rowsAffected = await updateCommand.ExecuteNonQueryAsync();
                        if (rowsAffected == 0)
                        {
                            transaction.Rollback();
                            return false;
                        }

                        transaction.Commit();
                        return true;
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        Console.WriteLine($"Error in UpdateFileAsync: {ex.Message}");
                        throw;
                    }
                }
            }
        }

        public bool enableSystem(int SystemID)
        {
            string sql = @"
BEGIN
    UPDATE SYSTEMS 
    SET IS_DELETED = 0 
    WHERE SYSTEMID = :SyestemId;

    UPDATE SYSTEMS  
    SET IS_DELETED = 0 
    WHERE SYSTEMID = :SyestemId;
END;";

            var parameters = new[]
            {

                  new OracleParameter(":SyestemID", SystemID)

            };

            int rowsAffected = _context.Database.ExecuteSqlRaw(sql, parameters);

            if (rowsAffected == 0)
            {
                throw new Exception("No rows were updated. System may not exist.");
            }
            return true;
        }


        public bool disableSystem(int SystemID)
        {
            try
            {
                string sql = @"
BEGIN
    UPDATE SYSTEMS 
    SET IS_DELETED = 1 
    WHERE SYSTEMID = :SyestemId;

    UPDATE SYSTEMS 
    SET IS_DELETED = 1 
    WHERE SYSTEMID = :SyestemId;
END;";

                var parameters = new[]
                {

                  new OracleParameter(":SyestemID", SystemID)

            };

                int rowsAffected = _context.Database.ExecuteSqlRaw(sql, parameters);

                if (rowsAffected == 0)
                {
                    throw new Exception("No rows were updated. System may not exist.");
                }
                return true;
            }
            catch (Exception ex)
            {
     
                return false;
            }
        }
    
    }

}
