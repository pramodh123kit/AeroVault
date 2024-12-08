using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AeroVault.Models;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Text.Json;
using System.ComponentModel.DataAnnotations;
using System.Data;
using Oracle.ManagedDataAccess.Types;

namespace AeroVault.Controllers
{
    public class SystemsController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly string _connectionString = "User Id=c##aerovault;Password=123;Data Source=localhost:1521/xe;";

        public SystemsController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var systems = await GetAllSystemsAsync();

            return View("~/Views/Admin/_Systems.cshtml", systems);
        }

        // Method to read the systems
        public async Task<List<SystemModel>> GetAllSystemsAsync()
        {
            return await _context.Set<SystemModel>().FromSqlRaw("SELECT * FROM C##AEROVAULT.SYSTEMS").ToListAsync();
        }

        [HttpPost]
        public async Task<IActionResult> CheckSystemExists([FromBody] SystemExistsRequest request)
        {
            try
            {
                string sql = "SELECT COUNT(*) FROM C##AEROVAULT.SYSTEMS WHERE LOWER(SystemName) = LOWER(:SystemName)";
                using (var connection = new OracleConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (var command = new OracleCommand(sql, connection))
                    {
                        command.Parameters.Add(new OracleParameter(":SystemName", request.SystemName));
                        int count = Convert.ToInt32(await command.ExecuteScalarAsync());
                        bool exists = count > 0;
                        return Json(new { exists });
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error: " + ex.Message });
            }
        }

        // DTO for the request
        public class SystemExistsRequest
        {
            public string SystemName { get; set; }
        }

        // DTO for creating a system
        public class CreateSystemRequest
        {
            public string SystemName { get; set; }
            public string Description { get; set; }
            public List<int> DepartmentIds { get; set; }
        }

        [HttpPost]
        public async Task<IActionResult> CreateSystem([FromBody] CreateSystemRequest request)
        {
            // Validate input
            if (request == null)
            {
                return BadRequest(new { message = "Invalid system data" });
            }

            // Validate system name
            if (string.IsNullOrWhiteSpace(request.SystemName))
            {
                return BadRequest(new { message = "System name is required" });
            }

            // Validate description
            if (string.IsNullOrWhiteSpace(request.Description))
            {
                return BadRequest(new { message = "Description is required" });
            }

            // Validate department IDs
            if (request.DepartmentIds == null || !request.DepartmentIds.Any())
            {
                return BadRequest(new { message = "At least one department must be selected" });
            }

            OracleConnection connection = null;
            OracleTransaction transaction = null;

            try
            {
                connection = new OracleConnection(_connectionString);
                await connection.OpenAsync();

                // Start a transaction
                transaction = connection.BeginTransaction();

                try
                {
                    // Check if system name already exists
                    string checkSql = "SELECT COUNT(*) FROM C##AEROVAULT.SYSTEMS WHERE LOWER(SYSTEMNAME) = LOWER(:SystemName)";
                    using (var checkCommand = new OracleCommand(checkSql, connection))
                    {
                        checkCommand.Transaction = transaction;
                        checkCommand.Parameters.Add(new OracleParameter(":SystemName", request.SystemName));

                        int count = Convert.ToInt32(await checkCommand.ExecuteScalarAsync());

                        if (count > 0)
                        {
                            return Conflict(new { message = "A system with this name already exists" });
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
                        // Add input parameters
                        insertCommand.Parameters.Add(new OracleParameter(":SystemName", request.SystemName));
                        insertCommand.Parameters.Add(new OracleParameter(":Description", request.Description));

                        // Output parameter for the new system ID
                        var systemIdParam = new OracleParameter(":NewSystemID", OracleDbType.Int32)
                        {
                            Direction = System.Data.ParameterDirection.Output
                        };
                        insertCommand.Parameters.Add(systemIdParam);

                        // Execute the insert
                        await insertCommand.ExecuteNonQueryAsync();

                        // Safely get the new system ID
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

                    // Commit the transaction
                    transaction.Commit();

                    // Prepare and return the response
                    return Ok(new
                    {
                        systemId = newSystemId,
                        systemName = request.SystemName,
                        description = request.Description,
                        departments = request.DepartmentIds
                    });
                }
                catch (OracleException ex)
                {
                    // Rollback the transaction
                    transaction?.Rollback();

                    // Log the full exception details
                    Console.WriteLine($"Oracle Exception: {ex}");
                    Console.WriteLine($"Error Code: {ex.ErrorCode}");
                    Console.WriteLine($"Exception Message: {ex.Message}");
                    Console.WriteLine($"Stack Trace: {ex.StackTrace}");

                    return StatusCode(500, new
                    {
                        message = "An error occurred while creating the system",
                        details = ex.Message,
                        errorCode = ex.ErrorCode
                    });
                }
                catch (Exception ex)
                {
                    // Rollback the transaction
                    transaction?.Rollback();

                    // Log the full exception details
                    Console.WriteLine($"Outer Exception: {ex}");
                    Console.WriteLine($"Exception Type: {ex.GetType().FullName}");
                    Console.WriteLine($"Exception Message: {ex.Message}");
                    Console.WriteLine($"Stack Trace: {ex.StackTrace}");

                    return StatusCode(500, new
                    {
                        message = "An unexpected error occurred",
                        details = ex.Message,
                        exceptionType = ex.GetType().FullName
                    });
                }
            }
            finally
            {
                // Ensure proper disposal of resources
                transaction?.Dispose();
                connection?.Close();
                connection?.Dispose();
            }
        }

        // Helper method to convert Oracle Decimal to int
        private int ConvertOracleDecimal(object value)
        {
            return value switch
            {
                Oracle.ManagedDataAccess.Types.OracleDecimal oracleDecimal => oracleDecimal.ToInt32(),
                int intValue => intValue,
                _ => Convert.ToInt32(value)
            };
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteSystem(int systemId)
        {
            try
            {
                var system = await _context.Set<SystemModel>()
                    .FirstOrDefaultAsync(s => s.SystemID == systemId);

                if (system == null)
                {
                    return NotFound(new { message = "System not found" });
                }

                _context.Set<SystemModel>().Remove(system);
                await _context.SaveChangesAsync();

                return Ok(new { message = "System deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting system", error = ex.Message });
            }
        }




        [HttpGet]
        public async Task<IActionResult> GetDivisionsForPopup()
        {
            try
            {
                var divisions = new List<object>();

                // Fetch divisions
                string divisionsSql = "SELECT DivisionID, DivisionName FROM C##AEROVAULT.DIVISIONS";

                using (var connection = new OracleConnection(_context.Database.GetConnectionString()))
                {
                    await connection.OpenAsync();

                    // Fetch divisions
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

                return Json(divisions);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
    }
}