﻿using Oracle.ManagedDataAccess.Client;
using AeroVault.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using static AeroVault.Controllers.SystemsController;

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
            return await _context.Set<SystemModel>().FromSqlRaw("SELECT * FROM C##AEROVAULT.SYSTEMS").ToListAsync();
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

        public async Task<int> CreateSystemAsync(CreateSystemRequest request)
        {
            OracleConnection connection = null;
            OracleTransaction transaction = null;

            try
            {
                connection = new OracleConnection(_connectionString);
                await connection.OpenAsync();
                transaction = connection.BeginTransaction();

                // Check if system name already exists
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

                // Create new system 
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

                // Insert system-department associations
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

                // Fetch divisions
                string divisionsSql = "SELECT DivisionID, DivisionName FROM C##AEROVAULT.DIVISIONS";
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

                // Fetch departments
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

                // Group departments by division
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
    }
}